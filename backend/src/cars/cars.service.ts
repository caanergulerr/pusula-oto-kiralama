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
            if (count < 10) {
                if (count > 0) {
                    await this.carsRepository.clear();
                }
                const defaultCars = [
                    {
                        brand: 'Hyundai',
                        model: 'Bayon',
                        year: 2024,
                        dailyPrice: 1600,
                        plateNumber: '23 BYN 001',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'suv',
                        imageUrl: '/cars/1f1adcdd253e5c0a1d910a95745279141.jpg',
                        kmLimit: 350,
                        description: 'Yenilikçi crossover tasarımı, ferah iç hacmi ve üstün güvenlik donanımlarıyla Hyundai Bayon.',
                        specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Geri Görüş Kamerası', 'Şerit Takip', 'Apple CarPlay', 'Kablosuz Şarj', 'Klima']),
                    },
                    {
                        brand: 'Fiat',
                        model: 'Egea Cross',
                        year: 2024,
                        dailyPrice: 1400,
                        plateNumber: '23 FCR 002',
                        totalStock: 3,
                        availableStock: 3,
                        category: 'suv',
                        imageUrl: '/cars/3e2e1ae9d135d8667050c06c7488873f.jpg',
                        kmLimit: 300,
                        description: 'Crossover dinamizmi, yükseltilmiş gövdesi ve ekonomik motoruyla Fiat Egea Cross.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Tablet Ekran', 'Bluetooth', 'Hız Sabitleyici', 'Yokuş Kalkış Desteği', 'Klima']),
                    },
                    {
                        brand: 'Renault',
                        model: 'Clio Icon',
                        year: 2023,
                        dailyPrice: 1100,
                        plateNumber: '23 RCO 003',
                        totalStock: 3,
                        availableStock: 3,
                        category: 'hatchback',
                        imageUrl: '/cars/5ab43db3ee739fc9a7d328c84adf61110.png',
                        kmLimit: 300,
                        description: 'Şık beyaz tasarımı, ergonomik kokpiti ve düşük yakıt sarfiyatı ile şehir içi ve şehir dışı favoriniz.',
                        specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Dokunmatik Ekran', 'Anahtarsız Çalıştırma', 'Bluetooth', 'Park Sensörü', 'Klima']),
                    },
                    {
                        brand: 'Renault',
                        model: 'Clio Touch',
                        year: 2022,
                        dailyPrice: 1000,
                        plateNumber: '23 RCL 004',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'hatchback',
                        imageUrl: '/cars/4d3b5e844823826e86b561f0c441b197.png',
                        kmLimit: 300,
                        description: 'Kompakt yapısı, kolay park imkânı ve ekonomik yakıt tüketimiyle ideal kiralık araç.',
                        specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Manuel', seats: 5 }),
                        features: JSON.stringify(['Bluetooth', 'USB', 'Klima', 'Elektrikli Aynalar']),
                    },
                    {
                        brand: 'Fiat',
                        model: 'Egea Sedan',
                        year: 2023,
                        dailyPrice: 1300,
                        plateNumber: '23 FES 005',
                        totalStock: 4,
                        availableStock: 4,
                        category: 'sedan',
                        imageUrl: '/cars/6894b7e0695becab108101ee1268dd314.png',
                        kmLimit: 300,
                        description: '520 litrelik dev bagaj hacmi ve yüksek konforlu süspansiyonu ile ailelerin ve iş gezilerinin bir numaralı tercihi.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Manuel', seats: 5 }),
                        features: JSON.stringify(['Geniş Bagaj', 'Bluetooth', 'Klima', 'Hız Sabitleyici', 'Yol Bilgisayarı']),
                    },
                    {
                        brand: 'Fiat',
                        model: 'Egea Lounge',
                        year: 2024,
                        dailyPrice: 1350,
                        plateNumber: '23 FEL 006',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'sedan',
                        imageUrl: '/cars/sedan.jpg',
                        kmLimit: 350,
                        description: 'Lounge donanım paketi, zarafet dolu hatları ve konforlu sürüş deneyimiyle Fiat Egea Sedan.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Geri Görüş Kamerası', 'Dijital Klima', 'Deri Direksiyon', 'Çelik Jant', 'CarPlay']),
                    },
                    {
                        brand: 'Renault',
                        model: 'Taliant',
                        year: 2023,
                        dailyPrice: 1250,
                        plateNumber: '23 RTL 007',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'sedan',
                        imageUrl: '/cars/9543f579c9c768699456ac230c99f2da.jpg',
                        kmLimit: 300,
                        description: 'Modern sedan çizgileri, geniş diz mesafesi ve üstün bagaj kapasitesiyle Renault Taliant.',
                        specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Multimedya Ekranı', 'Hız Sınırlayıcı', 'Bluetooth', 'Klima', 'Gündüz Led Farı']),
                    },
                    {
                        brand: 'Hyundai',
                        model: 'i20 Style',
                        year: 2023,
                        dailyPrice: 1200,
                        plateNumber: '23 HIS 008',
                        totalStock: 3,
                        availableStock: 3,
                        category: 'hatchback',
                        imageUrl: '/cars/hatchback.jpg',
                        kmLimit: 300,
                        description: 'Yüksek teknoloji, dinamik sürüş pozisyonu ve ferah iç tasarımı ile Hyundai i20.',
                        specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Manuel', seats: 5 }),
                        features: JSON.stringify(['Apple CarPlay', 'Geri Görüş', 'Bluetooth', 'Hız Sabitleyici', 'Klima']),
                    },
                    {
                        brand: 'Hyundai',
                        model: 'i20 Jump',
                        year: 2022,
                        dailyPrice: 1150,
                        plateNumber: '23 HIJ 009',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'hatchback',
                        imageUrl: '/cars/bb622d833580d631acdf1fa756b25c1010.png',
                        kmLimit: 300,
                        description: 'Şehir içi trafikte pratik, az yakan ve seri yapısıyla ekonomik konfor.',
                        specs: JSON.stringify({ fuelType: 'Benzin', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Otomatik Vites', 'Klima', 'Bluetooth', 'Yokuş Kalkış']),
                    },
                    {
                        brand: 'Dacia',
                        model: 'Duster Prestige',
                        year: 2023,
                        dailyPrice: 1500,
                        plateNumber: '23 DDP 010',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'suv',
                        imageUrl: '/cars/5584d4e431f624e84b262109ec7e5cc6f.jpg',
                        kmLimit: 350,
                        description: 'Yüksek tabanlı sağlam gövdesi ve güçlü dizel motoruyla her türlü yol koşulunda güven veren SUV.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Manuel', seats: 5 }),
                        features: JSON.stringify(['Navigasyon', 'Kör Nokta Uyarısı', 'Park Sensörü', 'Hız Sabitleyici', 'Klima']),
                    },
                    {
                        brand: 'Dacia',
                        model: 'Duster Comfort',
                        year: 2023,
                        dailyPrice: 1450,
                        plateNumber: '23 DDC 011',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'suv',
                        imageUrl: '/cars/suv.jpg',
                        kmLimit: 350,
                        description: 'Geniş bagaj alanı, ferah kabin ve güçlü yol tutuşuyla Dacia Duster.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Manuel', seats: 5 }),
                        features: JSON.stringify(['Eco Mod', 'Bluetooth', 'Klima', 'Yokuş İniş Desteği']),
                    },
                    {
                        brand: 'Fiat',
                        model: 'Doblo Combi',
                        year: 2024,
                        dailyPrice: 1700,
                        plateNumber: '23 FDC 012',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'minivan',
                        imageUrl: '/cars/545ddcbd95b91038dfb4c719b9c04dadc.jpg',
                        kmLimit: 400,
                        description: 'Yeni nesil şık tasarım, sürgülü yan kapılar ve geniş taşıma hacmiyle ticari ve ailevi seyahatlerinizde mükemmel çözüm.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Manuel', seats: 5 }),
                        features: JSON.stringify(['Geniş Yük Hacmi', 'Dokunmatik Ekran', 'Bluetooth', 'Klima', 'Park Sensörü']),
                    },
                    {
                        brand: 'Toyota',
                        model: 'Corolla Hybrid',
                        year: 2024,
                        dailyPrice: 1650,
                        plateNumber: '23 TCH 013',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'sedan',
                        imageUrl: 'https://www.toyota.com.tr/content/dam/toyota/turkey/models/corolla/my23/corolla-gallery-01.jpg',
                        kmLimit: 350,
                        description: 'Kendi kendini şarj eden akıllı hibrit motoruyla ultra sessiz sürüş ve rekor yakıt tasarrufu.',
                        specs: JSON.stringify({ fuelType: 'Hibrit', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Hibrit Motor', 'Şerit Takip', 'Adaptif Hız Sabitleyici', 'Kablosuz Şarj', 'CarPlay']),
                    },
                    {
                        brand: 'Volkswagen',
                        model: 'Passat Elegance',
                        year: 2022,
                        dailyPrice: 2200,
                        plateNumber: '23 VPE 014',
                        totalStock: 1,
                        availableStock: 1,
                        category: 'sedan',
                        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Volkswagen_Passat_B8_Facelift_2.0_TDI_R-Line_Deep_Black_Pearl_%28front_quarter_view%29.jpg',
                        kmLimit: 400,
                        description: 'Alman mühendisliğinin prestijli sedanı; üstün konfor, sessiz kabin ve dinamik 2.0 TDI performansı.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Masajlı Koltuk', 'Panoramik Cam Tavan', 'Hayalet Ekran', 'Matrix LED Far', 'Koltuk Isıtma']),
                    },
                    {
                        brand: 'Peugeot',
                        model: '3008 Allure',
                        year: 2024,
                        dailyPrice: 1900,
                        plateNumber: '23 P30 015',
                        totalStock: 2,
                        availableStock: 2,
                        category: 'suv',
                        imageUrl: 'https://www.peugeot.com.tr/content/dam/peugeot/master/b2c/models/3008/my24/peugeot-3008-front-quarter.jpg',
                        kmLimit: 350,
                        description: 'Fütüristik i-Cockpit kabin, fener far tasarımı ve üst düzey SUV sürüş keyfi.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Otomatik', seats: 5 }),
                        features: JSON.stringify(['Cam Tavan', 'Şerit Konumlama', 'Kör Nokta', '360 Kamera', 'i-Cockpit']),
                    },
                    {
                        brand: 'Volkswagen',
                        model: 'Transporter VIP',
                        year: 2023,
                        dailyPrice: 2500,
                        plateNumber: '23 VTR 016',
                        totalStock: 1,
                        availableStock: 1,
                        category: 'minivan',
                        imageUrl: '/cars/minivan.jpg',
                        kmLimit: 400,
                        description: 'Geniş yolcu kapasitesi, VIP iç tasarım ve kalabalık aile/grup seyahatleri için eşsiz ferahlık.',
                        specs: JSON.stringify({ fuelType: 'Dizel', transmission: 'Manuel', seats: 9 }),
                        features: JSON.stringify(['9 Kişilik', 'Çift Klima', 'Geniş Bagaj', 'Bluetooth', 'Yolcu Konforu']),
                    }
                ];
                await this.carsRepository.save(defaultCars);
                console.log('✅ Orijinal araç filosu veritabanına otomatik eklendi.');
            }
        } catch (err) {
            console.error('Varsayılan araçlar yüklenirken hata:', err);
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
