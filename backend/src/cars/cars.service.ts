import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService {
    constructor(
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
    ) { }

    create(createCarDto: any) {
        const { fuelType, gearType, totalStock, ...carData } = createCarDto;

        // Create specs object from fuelType and gearType
        const specs = {
            fuelType: fuelType || 'Benzin',
            transmission: gearType || 'Otomatik',
            seats: 5
        };

        const stock = totalStock || 1;

        const car = this.carsRepository.create({
            ...carData,
            specs: JSON.stringify(specs),
            totalStock: stock,
            availableStock: stock // Initially all stock is available
        });

        return this.carsRepository.save(car);
    }

    async findAll() {
        const cars = await this.carsRepository.find();
        return cars.map(car => ({
            ...car,
            status: car.availableStock > 0 ? 'AVAILABLE' : 'RENTED'
        }));
    }

    async findOne(id: string) {
        const car = await this.carsRepository.findOneBy({ id });
        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }
        return {
            ...car,
            status: car.availableStock > 0 ? 'AVAILABLE' : 'RENTED'
        };
    }

    async update(id: string, updateCarDto: any) {
        const car = await this.findOne(id);
        Object.assign(car, updateCarDto);
        return this.carsRepository.save(car);
    }

    async remove(id: string) {
        const car = await this.findOne(id);
        return this.carsRepository.remove(car);
    }

    async updateStock(id: string, change: number) {
        const car = await this.carsRepository.findOneBy({ id });
        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }

        car.availableStock += change;

        // Ensure availableStock doesn't go below 0 or above totalStock
        if (car.availableStock < 0) {
            throw new BadRequestException('Not enough available stock');
        }
        if (car.availableStock > car.totalStock) {
            car.availableStock = car.totalStock;
        }

        return this.carsRepository.save(car);
    }

    async searchCars(filters: {
        minPrice?: number;
        maxPrice?: number;
        fuelType?: string;
        gearType?: string;
        features?: string[];
    }) {
        const query = this.carsRepository.createQueryBuilder('car');

        // Price filters
        if (filters.minPrice !== undefined) {
            query.andWhere('car.dailyPrice >= :minPrice', { minPrice: filters.minPrice });
        }
        if (filters.maxPrice !== undefined) {
            query.andWhere('car.dailyPrice <= :maxPrice', { maxPrice: filters.maxPrice });
        }

        // Fuel type filter
        if (filters.fuelType) {
            query.andWhere("JSON_EXTRACT(car.specs, '$.fuelType') = :fuelType", {
                fuelType: filters.fuelType
            });
        }

        // Gear type filter
        if (filters.gearType) {
            query.andWhere("JSON_EXTRACT(car.specs, '$.transmission') = :gearType", {
                gearType: filters.gearType
            });
        }

        // Features filter - car must have all selected features
        if (filters.features && filters.features.length > 0) {
            filters.features.forEach((feature, index) => {
                query.andWhere(`car.features LIKE :feature${index}`, {
                    [`feature${index}`]: `%${feature}%`
                });
            });
        }

        const cars = await query.getMany();

        // Add dynamic status
        return cars.map(car => ({
            ...car,
            status: car.availableStock > 0 ? 'AVAILABLE' : 'RENTED'
        }));
    }

    async getMostRented(limit: number = 3) {
        // Simple approach: return available cars
        const cars = await this.carsRepository.find({
            take: limit,
            order: { createdAt: 'DESC' }
        });
        return cars;
    }
}
