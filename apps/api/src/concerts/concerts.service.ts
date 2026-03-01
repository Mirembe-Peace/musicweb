import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
  ) {}

  create(createConcertDto: any) {
    const concert = this.concertRepository.create(createConcertDto);
    return this.concertRepository.save(concert);
  }

  findAll() {
    return this.concertRepository.find();
  }

  // Get only the active concert (if any)
  async getActive() {
    return this.concertRepository.findOne({ where: { isEnabled: true } });
  }

  findOne(id: string) {
    return this.concertRepository.findOne({ where: { id } });
  }

  async update(id: string, updateConcertDto: any) {
    await this.concertRepository.update(id, updateConcertDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.concertRepository.delete(id);
  }
}
