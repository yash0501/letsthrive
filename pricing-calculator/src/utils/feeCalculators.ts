import { PricingFormData } from '../types';
import axios from 'axios';

export const calculateTotalFees = async (data: PricingFormData) => {
  const response = await axios.post('http://localhost:5000/api/v1/profitability-calculator', data);

  return response.data;
};