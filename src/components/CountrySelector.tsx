import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { fetchCountries } from '../lib/airtable';
import { toast } from 'react-hot-toast';

type CountrySelectorProps = {
  selected: string;
  onChange: (country: string) => void;
};

export default function CountrySelector({ selected, onChange }: CountrySelectorProps) {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries);
      } catch (error) {
        toast.error('Failed to load countries. Using default list.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCountries();
  }, []);

  const filteredCountries = query === ''
    ? countries
    : countries.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(country: string) => country}
            placeholder="Select a country..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              Loading countries...
            </div>
          ) : filteredCountries.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredCountries.map((country) => (
              <Combobox.Option
                key={country}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
                value={country}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {country}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}