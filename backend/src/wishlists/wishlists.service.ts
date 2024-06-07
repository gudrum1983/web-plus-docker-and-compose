import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    readonly wishesService: WishesService,
  ) {}

  async findAll(): Promise<Array<Wishlist>> {
    return await this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    const options: FindOneOptions<Wishlist> = {
      where: {
        id: id,
      },
      relations: ['items', 'owner'],
    };
    const wishlist = await this.wishlistRepository.findOne(options);
    return <Wishlist>instanceToPlain(wishlist);
  }

  async create(owner, createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const { itemsId, ...data } = createWishlistDto;
    const wishes: Array<Wish> = await this.wishesService.findByIds(itemsId);
    const createWishlist: Wishlist = this.wishlistRepository.create({
      ...data,
      owner: owner.id,
      items: wishes,
    });
    return await this.wishlistRepository.save(createWishlist);
  }

  async update(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(wishlistId);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('У вас нет прав на изменение');
    }
    if (updateWishlistDto.itemsId) {
      const wishes = await this.wishesService.findByIds(
        updateWishlistDto.itemsId,
      );
      wishlist.items.push(...wishes);
      await this.wishlistRepository.save(wishlist);
      await this.wishlistRepository.update(wishlistId, updateWishlistDto);
    } else {
      await this.wishlistRepository.update(wishlistId, updateWishlistDto);
    }
    return wishlist;
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.findOne(wishlistId);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('У вас нет прав на удаление');
    }
    await this.wishlistRepository.delete(wishlistId);
    return wishlist;
  }
}
