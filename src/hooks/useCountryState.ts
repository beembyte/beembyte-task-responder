
import { useState, useEffect } from 'react';

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
}

interface State {
  name: string;
  state_code: string;
}

// Define the specific African countries we want to show
const ALLOWED_AFRICAN_COUNTRIES = ['Nigeria', 'Ghana', 'South Africa', 'Kenya'];

export const useCountryState = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  // Fetch all countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
      const data = await response.json();
      
      // Filter to only show the specified African countries
      const filteredCountries = data.filter((country: Country) => 
        ALLOWED_AFRICAN_COUNTRIES.includes(country.name.common)
      );
      
      const sortedCountries = filteredCountries.sort((a: Country, b: Country) => 
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sortedCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchStates = async (countryCode: string) => {
    setIsLoadingStates(true);
    setStates([]);
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
        headers: {
          'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
        }
      });
      const data = await response.json();
      setStates(data || []);
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setIsLoadingStates(false);
    }
  };

  return {
    countries,
    states,
    isLoadingCountries,
    isLoadingStates,
    fetchStates
  };
};
