import api from "../../../shared/services/api"

export interface BreedOption {
    id: string;        
    english: string;
    translation: string;
}

export const breedService = {
    async getAllTranslations(): Promise<Record<string, string>> {
        const response = await api.get('/breeds/translations') 
        return response.data.data
    },

    async getTranslatedOptions(): Promise<BreedOption[]> {
        const [optionsRes, translationsRes] = await Promise.all([
            api.get('/breeds/options'),
            api.get('/breeds/translations')
        ]);

        const rawBreeds: string[] = optionsRes.data.data; 
        const translations: Record<string, string> = translationsRes.data.data;

        return rawBreeds.map((breed) => {
            const cleanEnglish = breed.replace(/_/g, ' '); 
            const translation = translations[breed] ?? cleanEnglish; 

            return {
                id: breed,           
                english: breed,      
                translation: translation 
            };
        });
    }
}