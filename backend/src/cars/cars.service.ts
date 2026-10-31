import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService implements OnModuleInit {
    constructor(
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
    ) { }

    async onModuleInit() {
        try {
            const count = await this.carsRepository.count();
            if (count === 0) {
                await this.carsRepository.save([
                    {
                        brand: 'Fiat',
                        model: 'Egea',
                        year: 2023,
                        dailyPrice: 2000,
                        plateNumber: '23 FEG 023',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'sedan',
                        imageUrl: '/cars/6894b7e0695becab108101ee1268dd314.png',
                        kmLimit: 300,
                        description: 'Geniş iç hacmi, düşük yakıt tüketimi ve konforlu sürüşüyle Fiat Egea Manuel.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Manuel', seats: 5 }),
                        features: JSON.stringify(['Bluetooth', 'USB', 'Klima', 'Hız Sabitleyici', 'Geniş Bagaj']),
                    },
                ]);
                console.log('✅ Fiat Egea (Manuel - 2000 TL) veritabanına eklendi.');
            }
        } catch (err) {
            console.error('onModuleInit hata:', err);
        }
    }

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
        const car = await this.carsRepository.findOneBy({ id });
        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }
        
        // fuelType ve gearType varsa specs'e de yaz
        const { fuelType, gearType, ...rest } = updateCarDto;
        if (fuelType || gearType) {
            const currentSpecs = car.specs ? JSON.parse(car.specs) : {};
            car.specs = JSON.stringify({
                ...currentSpecs,
                ...(fuelType && { fuelType }),
                ...(gearType && { transmission: gearType }),
            });
        }
        
        Object.assign(car, rest);
        console.log(`[CAR UPDATE] id=${id} imageUrl=${car.imageUrl}`);
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
        category?: string;
    }) {
        const query = this.carsRepository.createQueryBuilder('car');

        // Price filters
        if (filters.minPrice !== undefined) {
            query.andWhere('car.dailyPrice >= :minPrice', { minPrice: filters.minPrice });
        }
        if (filters.maxPrice !== undefined) {
            query.andWhere('car.dailyPrice <= :maxPrice', { maxPrice: filters.maxPrice });
        }

        // Category filter
        if (filters.category) {
            query.andWhere('car.category = :category', { category: filters.category });
        }

        // Fuel type filter
        if (filters.fuelType) {
            query.andWhere("car.specs LIKE :fuelType", {
                fuelType: `%${filters.fuelType}%`
            });
        }

        // Gear type filter
        if (filters.gearType) {
            query.andWhere("car.specs LIKE :gearType", {
                gearType: `%${filters.gearType}%`
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
