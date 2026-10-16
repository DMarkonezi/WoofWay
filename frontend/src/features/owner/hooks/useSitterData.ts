import { useState, useEffect } from 'react';
import { sittingOfferService, SittingOffer } from '../../sitter/services/sittingOfferService';
import { dogService, Dog } from '../../dogs/services/dogService';

export function useSitterData(id: string | undefined) {
  const [offer, setOffer] = useState<SittingOffer | null>(null);
  const [myDogs, setMyDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID nije pronađen.');
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      sittingOfferService.getById(id),
      dogService.getMy(),
    ])
      .then(([offerData, dogsData]) => {
        setOffer(offerData);
        setMyDogs(dogsData);
        setError(null);
      })
      .catch(() => setError('Greška pri učitavanju podataka.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { offer, myDogs, loading, error };
}