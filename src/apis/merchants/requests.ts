import type {
  CreateMerchantParams,
  GetMerchantListParams,
  GetMerchantListResponse,
  IMerchant,
  UpdateMerchantStatusParams,
} from './types';

import { faker } from '@faker-js/faker';

const mockMerchantList = (val: number): IMerchant[] => {
  return Array.from({ length: val }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    createdAt: faker.date.past().toISOString(),
    balance: Number.parseFloat(faker.finance.amount({ min: 0, max: 100000, dec: 2 })),
    status: faker.helpers.arrayElement(['active', 'inactive']) as 'active' | 'inactive',
  }));
};

export const getMerchantList = (
  params: GetMerchantListParams,
  signal?: AbortSignal
): Promise<GetMerchantListResponse> => {
  console.log("🚀 ~ getMerchantList ~ params:", params, signal);
  return new Promise<GetMerchantListResponse>((resolve) => {
    const random = Math.floor(Math.random() * 10) + 1;
    setTimeout(() => {
      // Apply filters
      let filteredData = mockMerchantList(random);
      
      // Filter by search
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredData = filteredData.filter(
          (merchant) =>
            merchant.firstName.toLowerCase().includes(searchLower) ||
            merchant.lastName.toLowerCase().includes(searchLower) ||
            merchant.email.toLowerCase().includes(searchLower) ||
            merchant.id.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by status
      if (params.status && params.status.length > 0) {
        const statusArray = params.status.includes('all') 
          ? ['active', 'inactive'] 
          : params.status;
        filteredData = filteredData.filter((merchant) => 
          statusArray.includes(merchant.status)
        );
      }
      
      resolve({
        data: filteredData,
        hasNextPage: false,
        page: params.page ?? 1,
        totalPage: 1,
        totalCount: 10,
      });
    }, 1000);
  });

  // return httpInstance.get<GetMerchantListResponse>(KEYS.MERCHANTS, { params, signal }).then((res) => res);
};

export const createMerchant = (
  params: CreateMerchantParams,
  signal?: AbortSignal
): Promise<IMerchant> => {
  console.log("🚀 ~ createMerchant ~ signal:", signal)
  // Mock implementation
  return new Promise<IMerchant>((resolve) => {
    setTimeout(() => {
      resolve({
        id: faker.string.uuid(),
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        createdAt: new Date().toISOString(),
        balance: 0,
        status: 'active',
      });
    }, 500);
  });
  
  // return httpInstance.post<IMerchant>(KEYS.MERCHANTS, params, { signal }).then((res) => res);
};

export const updateMerchantStatus = (
  params: UpdateMerchantStatusParams,
  signal?: AbortSignal
): Promise<IMerchant> => {
  console.log("🚀 ~ updateMerchantStatus ~ signal:", signal)
  // Mock implementation
  return new Promise<IMerchant>((resolve) => {
    setTimeout(() => {
      resolve({
        id: params.id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        createdAt: faker.date.past().toISOString(),
        balance: Number.parseFloat(faker.finance.amount({ min: 0, max: 100000, dec: 2 })),
        status: params.status,
      });
    }, 500);
  });
  
  // const url = KEYS.MERCHANT_STATUS.replace(':id', params.id);
  // return httpInstance.patch<IMerchant>(url, { status: params.status }, { signal }).then((res) => res);
};
