import { API_URL } from '../constants/config';

export const fetchGyartok = async () => {
  const response = await fetch(`${API_URL}/api/gyartok`);
  if (!response.ok) throw new Error('Hiba a gyártók lekérése során');
  return response.json();
};

export const fetchMobilok = async () => {
  const response = await fetch(`${API_URL}/api/mobilok`);
  if (!response.ok) throw new Error('Hiba a mobilok lekérése során');
  return response.json();
};

export const addMobil = async (mobil) => {
  const response = await fetch(`${API_URL}/api/mobilok`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mobil),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Hiba az adatfelvétel során');
  return data;
};

export const updateMobil = async (id, data) => {
  const response = await fetch(`${API_URL}/api/mobilok/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(text || 'Hiba a módosítás során');
  return JSON.parse(text);
};

export const deleteMobil = async (id) => {
  const response = await fetch(`${API_URL}/api/mobilok/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Hiba a törlés során');
  return response.text();
};
