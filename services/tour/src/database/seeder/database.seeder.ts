import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../sub-category/entities/sub-category';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const categories = [
      {
        name: 'Sports & Adventure',
        description: 'Active experiences and outdoor adventures',
        subcategories: [
          {
            name: 'Day Hikes',
            description:
              'Short guided hikes suitable for beginners and families',
          },
          {
            name: 'Multi-day Treks',
            description: 'Extended hiking adventures with overnight stays',
          },
          {
            name: 'Mountain Climbing',
            description: 'Technical climbing and mountaineering expeditions',
          },
          {
            name: 'Scuba Diving',
            description:
              'Underwater exploration and diving certification courses',
          },
          {
            name: 'Surfing',
            description: 'Wave riding lessons and surf camps',
          },
          {
            name: 'Kayaking',
            description: 'River and sea kayaking adventures',
          },
          {
            name: 'Skydiving',
            description: 'Tandem jumps and skydiving certification courses',
          },
          {
            name: 'Bungee Jumping',
            description: 'Bridge and platform jumps with professional guidance',
          },
          {
            name: 'Rock Climbing',
            description: 'Indoor and outdoor climbing experiences',
          },
          {
            name: 'Mountain Biking',
            description: 'Off-road cycling adventures and trails',
          },
          {
            name: 'Road Cycling',
            description: 'Scenic road tours and cycling routes',
          },
          {
            name: 'Downhill Skiing',
            description: 'Ski lessons and resort experiences',
          },
          {
            name: 'Snowboarding',
            description: 'Snowboard lessons and freestyle sessions',
          },
          {
            name: 'Cross-country Skiing',
            description: 'Nordic skiing and winter trails',
          },
        ],
      },
      {
        name: 'History & Culture',
        description: 'Cultural experiences and historical exploration',
        subcategories: [
          {
            name: 'Ancient Ruins',
            description:
              'Exploration of archaeological sites and ancient civilizations',
          },
          {
            name: 'Castles & Palaces',
            description: 'Historic royal residences and fortifications',
          },
          {
            name: 'Religious Sites',
            description: 'Temples, churches, and sacred places',
          },
          {
            name: 'Art Museums',
            description: 'Fine art collections and contemporary exhibitions',
          },
          {
            name: 'History Museums',
            description: 'Historical artifacts and cultural heritage',
          },
          {
            name: 'Science Museums',
            description: 'Interactive science and technology exhibits',
          },
          {
            name: 'Traditional Crafts',
            description: 'Handicraft workshops and artisan demonstrations',
          },
          {
            name: 'Cultural Performances',
            description: 'Traditional music, dance, and theater',
          },
          {
            name: 'Local Festivals',
            description: 'Community celebrations and cultural events',
          },
        ],
      },
      {
        name: 'Nature & Wildlife',
        description: 'Natural wonders and wildlife experiences',
        subcategories: [
          {
            name: 'African Safari',
            description: 'Big five wildlife viewing in African reserves',
          },
          {
            name: 'Jungle Tours',
            description: 'Rainforest exploration and wildlife spotting',
          },
          {
            name: 'Marine Safari',
            description: 'Ocean wildlife watching and marine encounters',
          },
          {
            name: 'Wildlife Parks',
            description: 'Protected habitats for native wildlife',
          },
          {
            name: 'Nature Reserves',
            description: 'Conservation areas and natural landscapes',
          },
          {
            name: 'Botanical Gardens',
            description: 'Plant collections and garden tours',
          },
        ],
      },
      {
        name: 'Food & Drink',
        description: 'Culinary experiences and beverage tours',
        subcategories: [
          {
            name: 'Cooking Classes',
            description: 'Hands-on cooking lessons with local chefs',
          },
          {
            name: 'Food Tours',
            description: 'Guided tours of local cuisine and markets',
          },
          {
            name: 'Wine & Dine',
            description: 'Fine dining experiences with wine pairing',
          },
          {
            name: 'Vineyard Tours',
            description: 'Wine region exploration and vineyard visits',
          },
          {
            name: 'Wine Tasting',
            description: 'Wine sampling and sommelier sessions',
          },
          {
            name: 'Wine Making',
            description: 'Wine production and blending workshops',
          },
        ],
      },
      {
        name: 'Urban Experiences',
        description: 'City-based activities and urban exploration',
        subcategories: [
          {
            name: 'Walking Tours',
            description: 'Guided walking tours of city highlights',
          },
          {
            name: 'Architecture Tours',
            description: 'Building and design-focused city tours',
          },
          {
            name: 'Neighborhood Tours',
            description: 'Local area exploration and hidden gems',
          },
          {
            name: 'Local Markets',
            description: 'Traditional markets and artisanal shopping',
          },
          {
            name: 'Shopping Districts',
            description: 'Guided tours of shopping areas',
          },
          {
            name: 'Craft Shopping',
            description: 'Local crafts and souvenir shopping',
          },
        ],
      },
      {
        name: 'Wellness & Relaxation',
        description: 'Health, wellness, and relaxation experiences',
        subcategories: [
          {
            name: 'Spa Treatments',
            description: 'Massage and therapeutic treatments',
          },
          {
            name: 'Wellness Programs',
            description: 'Comprehensive wellness and health programs',
          },
          {
            name: 'Thermal Baths',
            description: 'Natural hot springs and thermal spa experiences',
          },
          {
            name: 'Yoga Retreats',
            description: 'Residential yoga programs and workshops',
          },
          {
            name: 'Meditation Sessions',
            description: 'Guided meditation and mindfulness practice',
          },
          {
            name: 'Wellness Workshops',
            description: 'Health and wellness educational sessions',
          },
        ],
      },
      {
        name: 'Luxury & Premium',
        description: 'High-end and exclusive experiences',
        subcategories: [
          {
            name: 'River Cruises',
            description: 'Luxury river journeys and cultural experiences',
          },
          {
            name: 'Ocean Cruises',
            description: 'Premium ocean voyages and island hopping',
          },
          {
            name: 'Yacht Charters',
            description: 'Private yacht experiences and coastal exploration',
          },
          {
            name: 'Private Tours',
            description: 'Exclusive guided experiences',
          },
          {
            name: 'VIP Access',
            description: 'Special access to attractions and events',
          },
          {
            name: 'Personal Concierge',
            description: 'Dedicated travel assistance and planning',
          },
        ],
      },
      {
        name: 'Education & Learning',
        description: 'Educational and skill-building experiences',
        subcategories: [
          {
            name: 'Cultural Immersion',
            description: 'Language practice through cultural activities',
          },
          {
            name: 'Photo Tours',
            description: 'Guided photography expeditions',
          },
          {
            name: 'Workshop Sessions',
            description: 'Photography technique and skill development',
          },
        ],
      },
    ];

    // Get existing categories and subcategories
    const existingCategories = await em.findAll(Category);
    const existingSubCategories = await em.findAll(SubCategory);

    // Create categories and their subcategories
    for (const categoryData of categories) {
      const { subcategories, ...categoryInfo } = categoryData;

      // Check if category already exists by name
      const existingCategory = existingCategories.find(
        (c) => c.name === categoryInfo.name,
      );

      let category: Category;
      if (existingCategory) {
        category = existingCategory;
      } else {
        category = new Category(categoryInfo);
        await em.persistAndFlush(category);
        existingCategories.push(category);
      }

      if (subcategories) {
        for (const subcategoryData of subcategories) {
          // Check if subcategory already exists by name within this category
          const existingSubCategory = existingSubCategories.find(
            (sc) =>
              sc.name === subcategoryData.name &&
              sc.category.id === category.id,
          );

          if (!existingSubCategory) {
            const subcategory = new SubCategory({
              ...subcategoryData,
              category,
            });
            await em.persistAndFlush(subcategory);
            existingSubCategories.push(subcategory);
          }
        }
      }
    }
  }
}
