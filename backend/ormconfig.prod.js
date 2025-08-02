const { DataSource } = require('typeorm');

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: 5432,
  username: process.env.POSTGRES_USER || 'student',
  password: process.env.POSTGRES_PASSWORD || 'student',
  database: process.env.POSTGRES_DB || 'kupi-podari-daj',
  entities: [
    'dist/user/entities/user.entity.js',
    'dist/wish/entities/wish.entity.js', 
    'dist/wishlist/entities/wishlist.entity.js',
    'dist/offer/entities/offer.entity.js'
  ],
  migrations: ['dist/migrations/*.js'],
}); 