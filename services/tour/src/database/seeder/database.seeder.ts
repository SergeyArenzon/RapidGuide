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
            id: '26a124a8-dc3f-43fa-af1f-b4ff4e9d3bbe',
          },
          {
            name: 'Multi-day Treks',
            description: 'Extended hiking adventures with overnight stays',
            id: '3730de88-a267-48cb-9195-9affb86a94fe',
          },
          {
            name: 'Mountain Climbing',
            description: 'Technical climbing and mountaineering expeditions',
            id: '63f0415d-cf1b-40fd-bab0-7d4602e2cab2',
          },
          {
            name: 'Scuba Diving',
            description:
              'Underwater exploration and diving certification courses',
            id: '13caa74c-42a4-4a46-a459-9c78801d7806',
          },
          {
            name: 'Surfing',
            description: 'Wave riding lessons and surf camps',
            id: '65d7f4ac-bc9c-4fac-914b-34c8f5d16542',
          },
          {
            name: 'Kayaking',
            description: 'River and sea kayaking adventures',
            id: '1cef5a61-4f45-4f68-803a-181b624d4578',
          },
          {
            name: 'Skydiving',
            description: 'Tandem jumps and skydiving certification courses',
            id: 'c117a32b-9cd9-4034-90c9-af30f23d4c01',
          },
          {
            name: 'Bungee Jumping',
            description: 'Bridge and platform jumps with professional guidance',
            id: '6f99cee0-5d92-45b6-9f56-75da64f877df',
          },
          {
            name: 'Rock Climbing',
            description: 'Indoor and outdoor climbing experiences',
            id: 'f0eb0f3a-eaa2-4748-9726-e45087ce4fdd',
          },
          {
            name: 'Mountain Biking',
            description: 'Off-road cycling adventures and trails',
            id: '9fdba14e-c02a-47e4-ad20-14209d7ddaa0',
          },
          {
            name: 'Road Cycling',
            description: 'Scenic road tours and cycling routes',
            id: '209a23c4-9c22-48fa-9fda-2608dae77e4a',
          },
          {
            name: 'Downhill Skiing',
            description: 'Ski lessons and resort experiences',
            id: 'f0873a97-0948-4d73-9bb2-72621aaeefd4',
          },
          {
            name: 'Snowboarding',
            description: 'Snowboard lessons and freestyle sessions',
            id: '4f83f780-876c-4a0a-aa56-68b3bc6f883c',
          },
          {
            name: 'Cross-country Skiing',
            description: 'Nordic skiing and winter trails',
            id: '116e12f2-3f85-4779-acfb-ccfda8e3d99d',
          },
        ],
        id: 'd8c13001-e16e-4e26-8c61-435480aa0e3c',
      },
      {
        name: 'History & Culture',
        description: 'Cultural experiences and historical exploration',
        subcategories: [
          {
            name: 'Ancient Ruins',
            description:
              'Exploration of archaeological sites and ancient civilizations',
            id: 'c5b33001-f691-4d94-831a-8d44185e5a53',
          },
          {
            name: 'Castles & Palaces',
            description: 'Historic royal residences and fortifications',
            id: '7bcdf597-0d4b-4c50-921b-f1a68a52ca9e',
          },
          {
            name: 'Religious Sites',
            description: 'Temples, churches, and sacred places',
            id: '07a8a248-b1d9-496b-9bf4-637f0c7e20e6',
          },
          {
            name: 'Art Museums',
            description: 'Fine art collections and contemporary exhibitions',
            id: '17286200-9242-46d7-b24e-f43fc32cfa67',
          },
          {
            name: 'History Museums',
            description: 'Historical artifacts and cultural heritage',
            id: 'ead865fd-5d64-437b-8f83-9b85e33a42b5',
          },
          {
            name: 'Science Museums',
            description: 'Interactive science and technology exhibits',
            id: '8857b97d-9238-4f1e-900b-2c26e624eef6',
          },
          {
            name: 'Traditional Crafts',
            description: 'Handicraft workshops and artisan demonstrations',
            id: 'a8844f2d-895e-4dfe-a80c-39b8f486287f',
          },
          {
            name: 'Cultural Performances',
            description: 'Traditional music, dance, and theater',
            id: 'cb39c37c-d9fb-43e6-b08a-5e1521bba108',
          },
          {
            name: 'Local Festivals',
            description: 'Community celebrations and cultural events',
            id: '408d5024-af60-45e3-a46f-5ba7cc993814',
          },
        ],
        id: 'ae24d77a-1631-4060-9503-c59c9d195e1c',
      },
      {
        name: 'Nature & Wildlife',
        description: 'Natural wonders and wildlife experiences',
        subcategories: [
          {
            name: 'African Safari',
            description: 'Big five wildlife viewing in African reserves',
            id: '33b237c9-b228-4e09-923b-790ab2732f93',
          },
          {
            name: 'Jungle Tours',
            description: 'Rainforest exploration and wildlife spotting',
            id: '2d968af0-2140-4884-bec5-53ab978024ff',
          },
          {
            name: 'Marine Safari',
            description: 'Ocean wildlife watching and marine encounters',
            id: '7073127c-44ea-40fd-adf1-931f8af8acd5',
          },
          {
            name: 'Wildlife Parks',
            description: 'Protected habitats for native wildlife',
            id: '2fb23e1d-479d-44de-bdb7-f77cdf843ede',
          },
          {
            name: 'Nature Reserves',
            description: 'Conservation areas and natural landscapes',
            id: '0de372cb-50f1-4460-a579-1a2d1d0ca080',
          },
          {
            name: 'Botanical Gardens',
            description: 'Plant collections and garden tours',
            id: '31468bf9-81a7-4869-8137-40b6ca1014cd',
          },
        ],
        id: '818c1b91-c5ba-4348-91d8-0a0545d3547a',
      },
      {
        name: 'Food & Drink',
        description: 'Culinary experiences and beverage tours',
        subcategories: [
          {
            name: 'Cooking Classes',
            description: 'Hands-on cooking lessons with local chefs',
            id: 'f07510ae-dd13-42f4-a634-9724de69688b',
          },
          {
            name: 'Food Tours',
            description: 'Guided tours of local cuisine and markets',
            id: 'f624687e-ee5d-4d25-9bca-4d1a7a1d0f64',
          },
          {
            name: 'Wine & Dine',
            description: 'Fine dining experiences with wine pairing',
            id: '24d3cef7-be7a-4fa8-a815-5088959c1f4d',
          },
          {
            name: 'Vineyard Tours',
            description: 'Wine region exploration and vineyard visits',
            id: 'dc25eff1-450f-46b5-8761-87c5db7f12da',
          },
          {
            name: 'Wine Tasting',
            description: 'Wine sampling and sommelier sessions',
            id: 'd055267a-b4dd-4f0f-9b38-008822663552',
          },
          {
            name: 'Wine Making',
            description: 'Wine production and blending workshops',
            id: '682b3efc-77de-4ccf-9b81-09c16536fd4a',
          },
        ],
        id: 'b6bba097-3648-403c-8365-6462a05e88aa',
      },
      {
        name: 'Urban Experiences',
        description: 'City-based activities and urban exploration',
        subcategories: [
          {
            name: 'Walking Tours',
            description: 'Guided walking tours of city highlights',
            id: '6fffb59d-ff4b-4f60-b57b-6963dbfd82f6',
          },
          {
            name: 'Architecture Tours',
            description: 'Building and design-focused city tours',
            id: '2e3f1ff6-1d0d-49bf-8f04-d55ccb93a8b2',
          },
          {
            name: 'Neighborhood Tours',
            description: 'Local area exploration and hidden gems',
            id: 'e5b41ce8-2359-4193-b8b9-ce3ad471a5c8',
          },
          {
            name: 'Local Markets',
            description: 'Traditional markets and artisanal shopping',
            id: '83ad7c0c-41ab-48f5-9ca9-a732b878943f',
          },
          {
            name: 'Shopping Districts',
            description: 'Guided tours of shopping areas',
            id: '8d0f82ea-225a-402f-a8b0-3b9d1a1505d4',
          },
          {
            name: 'Craft Shopping',
            description: 'Local crafts and souvenir shopping',
            id: 'e64c1c38-7f97-4adc-99f8-b1faf25b4e46',
          },
        ],
        id: '6bdac6a3-0894-4a92-9985-7374dd1617a3',
      },
      {
        name: 'Wellness & Relaxation',
        description: 'Health, wellness, and relaxation experiences',
        subcategories: [
          {
            name: 'Spa Treatments',
            description: 'Massage and therapeutic treatments',
            id: '6833c530-7f72-4559-ab11-d822b6f065d3',
          },
          {
            name: 'Wellness Programs',
            description: 'Comprehensive wellness and health programs',
            id: 'dd879eb2-19cc-44f5-a203-4ec30e8a5379',
          },
          {
            name: 'Thermal Baths',
            description: 'Natural hot springs and thermal spa experiences',
            id: '28174d1c-c66c-4756-ad57-9b57e4c1cedc',
          },
          {
            name: 'Yoga Retreats',
            description: 'Residential yoga programs and workshops',
            id: '0a7f21a4-82f6-46cd-8e54-c08dbc4a39b4',
          },
          {
            name: 'Meditation Sessions',
            description: 'Guided meditation and mindfulness practice',
            id: '5ad27193-0d5c-431b-9ada-be2ac6e5cce8',
          },
          {
            name: 'Conversation Practice',
            description: 'Interactive language practice sessions',
            id: '666e2666-9c8d-446e-b877-1d57a7ab8a84',
          },
          {
            name: 'Wellness Workshops',
            description: 'Health and wellness educational sessions',
            id: '922ae9de-c1f6-4497-914f-610a66f19820',
          },
        ],
        id: 'af499c2b-b2c5-4c5e-b039-0fbfb829e60a',
      },
      {
        name: 'Luxury & Premium',
        description: 'High-end and exclusive experiences',
        subcategories: [
          {
            name: 'River Cruises',
            description: 'Luxury river journeys and cultural experiences',
            id: 'c32f4fa4-c869-4378-8193-62ac03e7f7ba',
          },
          {
            name: 'Ocean Cruises',
            description: 'Premium ocean voyages and island hopping',
            id: '3d33d1ae-0093-45a4-a3d4-ad394a33d597',
          },
          {
            name: 'Yacht Charters',
            description: 'Private yacht experiences and coastal exploration',
            id: 'a9b5201d-35b2-4ce5-a08e-ce911859ac88',
          },
          {
            name: 'Private Tours',
            description: 'Exclusive guided experiences',
            id: '9adffb50-3b14-414e-9bda-a14cbe4c533c',
          },
          {
            name: 'VIP Access',
            description: 'Special access to attractions and events',
            id: '79c79d31-f8d5-4ffe-b574-7f21e45dd1b8',
          },
          {
            name: 'Personal Concierge',
            description: 'Dedicated travel assistance and planning',
            id: '378d4cb4-55d7-4149-88e5-e3051e12b349',
          },
        ],
        id: '24cf4193-bb6a-4ac2-9ed0-c09df3db4e51',
      },
      {
        name: 'Education & Learning',
        description: 'Educational and skill-building experiences',
        subcategories: [
          {
            name: 'Language Courses',
            description: 'Structured language learning programs',
            id: 'daf41590-901a-4c0a-a118-59423ab3a09f',
          },
          {
            name: 'Cultural Immersion',
            description: 'Language practice through cultural activities',
            id: '08af1bbc-2ca9-4ab3-a86e-e17e3ff023f9',
          },
          {
            name: 'Conversation Practice',
            description: 'Interactive language practice sessions',
            id: 'f67d3d3b-31b2-44b4-a60e-6f9321721ce4',
          },
          {
            name: 'Photo Tours',
            description: 'Guided photography expeditions',
            id: 'fb20a788-5f8f-4a0f-8df1-003304d4e183',
          },
          {
            name: 'Workshop Sessions',
            description: 'Photography technique and skill development',
            id: 'e16e7357-03c2-417d-96ba-2a07f8ab133d',
          },
          {
            name: 'Equipment Training',
            description: 'Camera and equipment usage training',
            id: '05eef55f-e6ef-487f-b55c-6b011b2df3bb',
          },
        ],
        id: '060ef79f-f29a-4f3f-8337-b55f0ca38f53',
      },
      {
        name: 'Sustainable Tourism',
        description: 'Eco-friendly and community-focused travel',
        subcategories: [
          {
            name: 'Conservation Projects',
            description: 'Wildlife and environmental conservation',
            id: '4d60d6c4-b5f5-45ce-a608-3428a1a4c65a',
          },
          {
            name: 'Community Development',
            description: 'Local community support and development',
            id: '83683ffe-8b98-4d15-8868-30204f6342a7',
          },
          {
            name: 'Education Programs',
            description: 'Teaching and educational support',
            id: 'e163ba52-2713-40b4-96ad-8e051140585e',
          },
          {
            name: 'Eco Lodges',
            description: 'Sustainable accommodation experiences',
            id: 'f8f2e39a-355b-429d-87e8-8cee7c80132f',
          },
          {
            name: 'Nature Conservation',
            description: 'Protected area visits and conservation',
            id: '9c27c6ce-c137-4066-a1b3-4352a2f68ebe',
          },
          {
            name: 'Sustainable Activities',
            description: 'Eco-friendly tours and activities',
            id: '61bee853-a865-445b-a995-3aee204e96fd',
          },
        ],
        id: '621513d2-bcc5-42eb-8fc5-52c3bbdbdc01',
      },
    ];

    // Create categories and their subcategories
    for (const categoryData of categories) {
      const { subcategories, ...categoryInfo } = categoryData;
      const category = new Category(categoryInfo);
      await em.persistAndFlush(category);

      if (subcategories) {
        for (const subcategoryData of subcategories) {
          const subcategory = new SubCategory({
            ...subcategoryData,
            category,
          });
          await em.persistAndFlush(subcategory);
        }
      }
    }
  }
}
