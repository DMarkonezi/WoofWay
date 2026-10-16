import { useState } from 'react';
import { sittingRequestService } from '../../../sitter/services/sittingRequestService';
import { SittingOffer } from '../../../sitter/services/sittingOfferService';
import { Dog } from '../../../dogs/services/dogService';
import { useNavigate } from 'react-router-dom';

interface Props {
  offer: SittingOffer;
  myDogs: Dog[];
  onClose: () => void;
  onSuccess: () => void;
}

export function RequestModal({ offer, myDogs, onClose, onSuccess }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ dogId: '', startTime: '', endTime: '', note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async () => {
   
    const newErrors: Record<string, string> = {};
    if (!form.dogId) newErrors.dogId = 'Izaberite psa.';
    if (!form.startTime) newErrors.startTime = 'Unesite datum početka.';
    if (!form.endTime) newErrors.endTime = 'Unesite datum završetka.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await sittingRequestService.create({
        sittingOfferId: offer.id,
        dogId: form.dogId,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        note: form.note || undefined,
      });
      onSuccess(); // Obavesti roditeljsku komponentu
    } catch {
      setApiError('Greška pri slanju. Pokušajte ponovo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-base font-semibold mb-4">Zahtev za čuvanje</h3>
        
        {/* Izbor psa */}
        <select 
          onChange={(e) => setForm({...form, dogId: e.target.value})}
          className="woof-input mb-3"
        >
          <option value="">— Izaberite psa —</option>
          {myDogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        
        {/* Inputi za vreme (koristi iste klase kao u tvom originalnom kodu) */}
        <input type="datetime-local" onChange={(e) => setForm({...form, startTime: e.target.value})} className="woof-input mb-3" />
        <input type="datetime-local" onChange={(e) => setForm({...form, endTime: e.target.value})} className="woof-input mb-3" />
        
        <button 
          onClick={handleSubmit} 
          disabled={submitting}
          className="w-full py-2 bg-woof-blue-600 text-white rounded-lg"
        >
          {submitting ? 'Slanje...' : 'Pošalji'}
        </button>
      </div>
    </div>
  );
}