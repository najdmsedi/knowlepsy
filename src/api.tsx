import axios from 'axios';
import { API_KEY, BASE_URL } from './config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateText = async (prompt: string) => {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  // console.log(text);
  return text
};

export const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  console.log(`${year}-${month}-${day}`);

  return `${year}-${month}-${day}`;
};

export const getFirstAndLastTime = (times: any[]) => {
  if (times.length === 0) {
    return { firstTime: null, lastTime: null };
  }
  const firstTime = times[0];
  const lastTime = times[times.length - 1];
  console.log(firstTime, lastTime );
  return { firstTime, lastTime };
};

export const calculateStatistics = (numbers: string) => {
  const numArray = numbers.split(',').map((num: string) => parseFloat(num));
  const max = Math.max(...numArray);
  const min = Math.min(...numArray);
  const sum = numArray.reduce((acc: number, val: number) => acc + val, 0);
  const avg = sum / numArray.length;
  console.log(max, min, avg);
  return { max, min, avg };
};

