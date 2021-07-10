import storage from './storage';
import { Brand } from './types';

const disk = storage.disk();

const brand = {
  async all() {
    const response = await disk.get('brands.json');
    return JSON.parse(response.content) as Record<string, Brand>;
  },

  async removeCoupon(brandName: string, coupon: string) {
    const brands = await this.all();
    const brand = brands[brandName];
    await disk.put(
      'brands.json',
      JSON.stringify({
        ...brands,
        [brandName]: {
          ...brand,
          coupons: brand.coupons.filter((c) => c !== coupon)
        }
      })
    );
  }
};

export default brand;
