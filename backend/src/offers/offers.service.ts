import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    readonly wishService: WishesService,
    readonly userService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    currentUser: User,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    const { amount, hidden, itemId } = createOfferDto;
    const currentWish = await this.wishService.findOneById(itemId);

    if (currentWish.owner.id === currentUser.id) {
      throw new ForbiddenException(
        'Вы серьёзно? Нельзя спонсировать собственный подарок.',
      );
    }

    if (currentWish.raised === currentWish.price) {
      throw new BadRequestException(
        'Вы опоздали, на этот подарок уже нельзя скинуться!',
      );
    }

    const sumWithRaised: number = currentWish.raised + amount;

    if (sumWithRaised > Number(currentWish.price)) {
      throw new BadRequestException(
        'Сумма заявки превышает стоимость подарка!',
      );
    }
    currentWish.raised = sumWithRaised;

    //todo почитать про блокировки
    /*https://stackoverflow.com/questions/69012855/typeorm-database-lock-please-explain-how-to-use-database-lock-in-typeorm-using*/
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const createOffer = this.offersRepository.create({
        item: currentWish,
        user: currentUser,
        amount: amount,
        hidden: hidden,
      });
      const newOffer = await queryRunner.manager.save(createOffer);
      currentWish.offers.push(newOffer);
      await queryRunner.manager.save(currentWish);
      await queryRunner.commitTransaction();
      return newOffer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async find(id?: number): Promise<Offer[]> {
    const options: FindManyOptions<Offer> = {
      order: { createdAt: 'desc' },
      where: {
        hidden: false,
      },
      relations: [
        'user',
        'user.wishlists',
        'user.wishlists.owner',
        'user.wishlists.items',
      ],
    };

    if (id !== undefined) {
      options.where = {
        id: id,
      };
    }

    return await this.offersRepository.find(options);
  }

  async findAll(): Promise<Array<Offer>> {
    return await this.find();
  }

  async findOne(id: number): Promise<Array<Offer>> {
    return await this.find(id);
  }
}
