import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { BASE_URL } from '../config';
import { TimeLevelAtom, DominantLevelAtom } from '../atoms';

export const useFetchStressData = (patientId:any, isConnected:any) => {
  const [concatenatedData, setConcatenatedData] = useState<any>([]);
  const [dominantStressLevel, setDominantStressLevel] = useState<any>(null);
  const setTimeLevel = useSetRecoilState(TimeLevelAtom);

  const fetchStressData = useCallback(async () => {
    try {
      const [responsePpg, responseEDA] = await Promise.all([
        axios.get(`${BASE_URL}/risk-cron/getLatestPpgDataForFiveMinute/${patientId}`),
        axios.get(`${BASE_URL}/risk-cron/getLatestEDADataForFiveMinute/${patientId}`)
      ]);

      const ppgData = responsePpg.data;
      const EDAData = responseEDA.data;

      const extractedDataPpg = ppgData.map((entry:any) => ({
        heart_rate: entry.PPG.heart_rate,
      }));

      const extractedDataEDA = EDAData.map((entry:any) => ({
        EDA: entry.EDA[0].EDA,
      }));

      setTimeLevel(EDAData[0].time);
      const minLength = Math.min(extractedDataEDA.length, extractedDataPpg.length);
      const data = [];

      for (let i = 0; i < minLength; i++) {
        data.push({
          EDA: extractedDataEDA[i].EDA,
          heart_rate: extractedDataPpg[i].heart_rate,
        });
      }

      setConcatenatedData(data);
    } catch (error) {
      console.error('Error fetching PPG or EDA data:', error);
    }
  }, [patientId, setTimeLevel]);

  const determineDominantStressLevel = useCallback((dataresponse:any) => {
    const countMap = dataresponse.reduce((acc:any, level:any) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    let maxCount = 0;
    let dominantLevel = null;

    for (const level in countMap) {
      if (countMap[level] > maxCount) {
        maxCount = countMap[level];
        dominantLevel = level;
      }
    }

    setDominantStressLevel(dominantLevel);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const processDataAndDetermineStress = async () => {
        await fetchStressData();

        if (concatenatedData.length > 0) {
          const dataresponse = await Promise.all(
            concatenatedData.map(async (dataPoint:any) => {
              const response = await axios.post('http://172.187.93.156:5000/Young_predict', {
                EDA: dataPoint.EDA,
                HeartRate: dataPoint.heart_rate,
              });
              return response.data.stress_level;
            })
          );

          determineDominantStressLevel(dataresponse);
        }
      };

      processDataAndDetermineStress();
      const intervalId = setInterval(processDataAndDetermineStress, 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [isConnected, fetchStressData, concatenatedData, determineDominantStressLevel]);

  return dominantStressLevel;
};

export const useUpdateStressIndicator = (dominantLevel:any) => {
  const [iconStress, setIconStress] = useState('happy');
  const [colorStress, setColorStress] = useState('gray');

  useEffect(() => {
    const updateStressIndicator = () => {
      switch (dominantLevel) {
        case 'low':
          setIconStress('happy');
          setColorStress('#3AA50E');
          break;
        case 'medium':
          setIconStress('happy');
          setColorStress('#D1837F');
          break;
        case 'high':
          setIconStress('sad');
          setColorStress('#B50F0F');
          break;
        default:
          setIconStress('happy');
          setColorStress('#bcbcbc');
          break;
      }
    };

    updateStressIndicator();
  }, [dominantLevel]);

  return { iconStress, colorStress };
};
