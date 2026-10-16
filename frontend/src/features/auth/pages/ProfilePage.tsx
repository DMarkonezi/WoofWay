// import { useEffect, useState, type FormEvent } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   userService,
//   UserProfile,
//   UpdateProfilePayload,
//   UpdateShelterDetailsPayload,
//   UpdateSitterDetailsPayload,
// } from '../services/userService'
// import { useAuth } from '../context/AuthContext'
// import Input from '../../../shared/components/Input'
// import Button from '../../../shared/components/Button'
// import Alert from '../../../shared/components/Alert'

// export default function ProfilePage() {
//   const navigate = useNavigate()
//   const { user } = useAuth()

//   const [profile, setProfile] = useState<UserProfile | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // Base form
//   const [baseForm, setBaseForm] = useState<UpdateProfilePayload>({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     city: '',
//   })
//   const [baseErrors, setBaseErrors] = useState<Partial<UpdateProfilePayload>>({})
//   const [baseSaving, setBaseSaving] = useState(false)
//   const [baseSuccess, setBaseSuccess] = useState(false)
//   const [baseApiError, setBaseApiError] = useState<string | null>(null)

//   const [shelterForm, setShelterForm] = useState<UpdateShelterDetailsPayload>({
//     shelterName: '',
//     address: '',
//     description: '',
//     capacity: 0,
//   })
//   const [shelterSaving, setShelterSaving] = useState(false)
//   const [shelterSuccess, setShelterSuccess] = useState(false)
//   const [shelterApiError, setShelterApiError] = useState<string | null>(null)

//   // Sitter form
//   const [sitterForm, setSitterForm] = useState<UpdateSitterDetailsPayload>({
//     bio: '',
//     pricePerHour: 0,
//   })
//   const [sitterSaving, setSitterSaving] = useState(false)
//   const [sitterSuccess, setSitterSuccess] = useState(false)
//   const [sitterApiError, setSitterApiError] = useState<string | null>(null)

//   useEffect(() => {
//     userService.getProfile()
//       .then((data) => {
//         setProfile(data)
//         setBaseForm({
//           firstName: data.firstName,
//           lastName: data.lastName,
//           phoneNumber: data.phoneNumber,
//           city: data.city,
//         })
//         if (data.role === 'Shelter' && data.roleDetails) {
//           setShelterForm({
//             shelterName: data.roleDetails.shelterName ?? '',
//             address: data.roleDetails.address ?? '',
//             description: data.roleDetails.description ?? '',
//             capacity: data.roleDetails.capacity ?? 0,
//           })
//         }
//         if (data.role === 'Sitter' && data.roleDetails) {
//           setSitterForm({
//             bio: data.roleDetails.bio ?? '',
//             pricePerHour: data.roleDetails.pricePerHour ?? 0,
//           })
//         }
//       })
//       .catch(() => setError('Greška pri učitavanju profila.'))
//       .finally(() => setLoading(false))
//   }, [])

//   function validateBase(values: UpdateProfilePayload): Partial<UpdateProfilePayload> {
//     const e: Partial<UpdateProfilePayload> = {}
//     if (!values.firstName.trim()) e.firstName = 'Ime je obavezno.'
//     if (!values.lastName.trim()) e.lastName = 'Prezime je obavezno.'
//     if (!values.phoneNumber.trim()) e.phoneNumber = 'Telefon je obavezan.'
//     if (!values.city.trim()) e.city = 'Grad je obavezan.'
//     return e
//   }


//   async function handleBaseSubmit(e: FormEvent) {
//     e.preventDefault()
//     setBaseSuccess(false)
//     setBaseApiError(null)

//     const errors = validateBase(baseForm)
//     if (Object.keys(errors).length > 0) {
//       setBaseErrors(errors)
//       return
//     }

//     setBaseSaving(true)
//     try {
//       await userService.updateProfile(baseForm)
//       setBaseSuccess(true)
//     } catch {
//       setBaseApiError('Greška pri čuvanju. Pokušajte ponovo.')
//     } finally {
//       setBaseSaving(false)
//     }
//   }


//   async function handleShelterSubmit(e: FormEvent) {
//     e.preventDefault()
//     setShelterSuccess(false)
//     setShelterApiError(null)
//     setShelterSaving(true)

//     const payload = {
//       ...shelterForm,
//       capacity: Number(shelterForm.capacity) || 0 
//     }

//     console.log("Pogle", shelterForm)

//     try {
//       await userService.updateShelterDetails(payload)
//       setShelterSuccess(true)
//     } catch {
//       setShelterApiError('Greška pri čuvanju. Pokušajte ponovo.')
//     } finally {
//       setShelterSaving(false)
//     }
//   }

//   async function handleSitterSubmit(e: FormEvent) {
//     e.preventDefault()
//     setSitterSuccess(false)
//     setSitterApiError(null)
//     setSitterSaving(true)
//     try {
//       await userService.updateSitterDetails(sitterForm)
//       setSitterSuccess(true)
//     } catch {
//       setSitterApiError('Greška pri čuvanju. Pokušajte ponovo.')
//     } finally {
//       setSitterSaving(false)
//     }
//   }


//   if (loading) {
//     return (
//       <div className="max-w-2xl space-y-4">
//         <div className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse" />
//         <div className="h-64 bg-white rounded-xl border border-gray-100 animate-pulse" />
//       </div>
//     )
//   }

//   if (error || !profile) {
//     return <p className="text-sm text-red-500">{error ?? 'Greška.'}</p>
//   }

//   const BACK_ROUTE = {
//     Owner:   '/dashboard/owner/my-dogs',
//     Sitter:  '/dashboard/sitter/offers',
//     Shelter: '/dashboard/shelter/dogs',
//   }

//   return (
//     <div className="max-w-2xl">
//       {/* Nazad */}
//       <button
//         onClick={() => navigate(BACK_ROUTE[profile.role])}
//         className="text-sm text-gray-400 hover:text-gray-600
//                    transition-colors mb-4 flex items-center gap-1"
//       >
//         ← Nazad
//       </button>

//       {/* Avatar + info */}
//       <div className="bg-white rounded-xl border border-gray-100
//                       shadow-card p-6 mb-4 flex items-center gap-4">
//         <div className="w-16 h-16 rounded-full bg-woof-blue-100
//                         flex items-center justify-center
//                         text-woof-blue-600 text-2xl font-semibold shrink-0">
//           {profile.firstName?.[0]?.toUpperCase() ?? '?'}
//         </div>
//         <div>
//           <h1 className="text-lg font-semibold text-gray-900">
//             {profile.firstName} {profile.lastName}
//           </h1>
//           <p className="text-sm text-gray-400">{profile.email}</p>
//           <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full
//                            bg-woof-blue-100 text-woof-blue-700 font-medium">
//             {profile.role}
//           </span>
//         </div>
//       </div>

//       {/* Osnovna forma */}
//       <div className="bg-white rounded-xl border border-gray-100
//                       border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-4">
//         <h2 className="text-sm font-semibold text-gray-700 mb-4">
//           Osnovni podaci
//         </h2>

//         {baseApiError && <Alert type="error" message={baseApiError} />}
//         {baseSuccess && (
//           <Alert type="success" message="Podaci su uspešno sačuvani." />
//         )}

//         <form onSubmit={handleBaseSubmit} noValidate>
//           <div className="grid grid-cols-2 gap-3">
//             <Input
//               label="Ime *"
//               value={baseForm.firstName}
//               onChange={(e) => {
//                 setBaseForm((p) => ({ ...p, firstName: e.target.value }))
//                 setBaseErrors((p) => ({ ...p, firstName: undefined }))
//               }}
//               error={baseErrors.firstName}
//             />
//             <Input
//               label="Prezime *"
//               value={baseForm.lastName}
//               onChange={(e) => {
//                 setBaseForm((p) => ({ ...p, lastName: e.target.value }))
//                 setBaseErrors((p) => ({ ...p, lastName: undefined }))
//               }}
//               error={baseErrors.lastName}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <Input
//               label="Telefon *"
//               type="tel"
//               value={baseForm.phoneNumber}
//               onChange={(e) => {
//                 setBaseForm((p) => ({ ...p, phoneNumber: e.target.value }))
//                 setBaseErrors((p) => ({ ...p, phoneNumber: undefined }))
//               }}
//               error={baseErrors.phoneNumber}
//             />
//             <Input
//               label="Grad *"
//               value={baseForm.city}
//               onChange={(e) => {
//                 setBaseForm((p) => ({ ...p, city: e.target.value }))
//                 setBaseErrors((p) => ({ ...p, city: undefined }))
//               }}
//               error={baseErrors.city}
//             />
//           </div>

//           {/* Email — read only */}
//           <div className="mb-4">
//             <label className="woof-label">Email</label>
//             <input
//               type="email"
//               value={profile.email}
//               disabled
//               className="woof-input bg-gray-50 text-gray-400 cursor-not-allowed"
//             />
//           </div>

//           <Button type="submit" variant="primary" loading={baseSaving}>
//             Sačuvaj izmene
//           </Button>
//         </form>
//       </div>

//       {/* Sitter detalji */}
//       {profile.role === 'Sitter' && (
//         <div className="bg-white rounded-xl border border-gray-100
//                         border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-4">
//           <h2 className="text-sm font-semibold text-gray-700 mb-4">
//             Podaci čuvara
//           </h2>

//           {sitterApiError && <Alert type="error" message={sitterApiError} />}
//           {sitterSuccess && (
//             <Alert type="success" message="Podaci su uspešno sačuvani." />
//           )}

//           <form onSubmit={handleSitterSubmit} noValidate>
//             <div className="mb-4">
//               <label className="woof-label">Bio / Opis</label>
//               <textarea
//                 rows={4}
//                 placeholder="Opišite svoje iskustvo sa psima..."
//                 value={sitterForm.bio}
//                 onChange={(e) =>
//                   setSitterForm((p) => ({ ...p, bio: e.target.value }))
//                 }
//                 className="woof-input resize-none"
//               />
//             </div>
//             <Input
//               label="Cena po satu (RSD)"
//               type="number"
//               min="1"
//               value={String(sitterForm.pricePerHour)}
//               onChange={(e) =>
//                 setSitterForm((p) => ({
//                   ...p,
//                   pricePerHour: Number(e.target.value),
//                 }))
//               }
//             />
//             <Button type="submit" variant="primary" loading={sitterSaving}>
//               Sačuvaj
//             </Button>
//           </form>
//         </div>
//       )}

//       {/* Shelter detalji */}
//       {profile.role === 'Shelter' && (
//         <div className="bg-white rounded-xl border border-gray-100
//                         border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-4">
//           <h2 className="text-sm font-semibold text-gray-700 mb-4">
//             Podaci azila
//           </h2>

//           {shelterApiError && <Alert type="error" message={shelterApiError} />}
//           {shelterSuccess && (
//             <Alert type="success" message="Podaci su uspešno sačuvani." />
//           )}

//           <form onSubmit={handleShelterSubmit} noValidate>
//             <Input
//               label="Naziv azila"
//               value={shelterForm.shelterName}
//               onChange={(e) =>
//                 setShelterForm((p) => ({ ...p, shelterName: e.target.value }))
//               }
//             />
//             <Input
//               label="Adresa"
//               value={shelterForm.address}
//               onChange={(e) =>
//                 setShelterForm((p) => ({ ...p, address: e.target.value }))
//               }
//             />
//             <div className="mb-4">
//               <label className="woof-label">Opis azila</label>
//               <textarea
//                 rows={3}
//                 value={shelterForm.description}
//                 onChange={(e) =>
//                   setShelterForm((p) => ({
//                     ...p,
//                     description: e.target.value,
//                   }))
//                 }
//                 className="woof-input resize-none"
//               />
//             </div>
//             <Input
//               label="Kapacitet"
//               type="number"
//               min="1"
//               value={String(shelterForm.capacity)}
//               onChange={(e) =>
//                 setShelterForm((p) => ({
//                   ...p,
//                   capacity: Number(e.target.value),
//                 }))
//               }
//             />
//             <Button type="submit" variant="primary" loading={shelterSaving}>
//               Sačuvaj
//             </Button>
//           </form>
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  userService,
  UserProfile,
  UpdateProfilePayload,
  UpdateShelterDetailsPayload,
  UpdateSitterDetailsPayload,
} from '../services/userService'
import { useAuth } from '../context/AuthContext'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import Alert from '../../../shared/components/Alert'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [baseForm, setBaseForm] = useState<UpdateProfilePayload>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    city: '',
  })
  const [baseErrors, setBaseErrors] = useState<Partial<UpdateProfilePayload>>({})
  const [baseSaving, setBaseSaving] = useState(false)
  const [baseSuccess, setBaseSuccess] = useState(false)
  const [baseApiError, setBaseApiError] = useState<string | null>(null)

  const [shelterForm, setShelterForm] = useState<UpdateShelterDetailsPayload>({
    shelterName: '',
    address: '',
    description: '',
    capacity: 0,
  })
  const [shelterSaving, setShelterSaving] = useState(false)
  const [shelterSuccess, setShelterSuccess] = useState(false)
  const [shelterApiError, setShelterApiError] = useState<string | null>(null)

  const [sitterForm, setSitterForm] = useState<UpdateSitterDetailsPayload>({
    bio: '',
    pricePerHour: 0,
  })
  const [sitterSaving, setSitterSaving] = useState(false)
  const [sitterSuccess, setSitterSuccess] = useState(false)
  const [sitterApiError, setSitterApiError] = useState<string | null>(null)

  useEffect(() => {
    userService.getProfile()
      .then((data) => {
        setProfile(data)
        setBaseForm({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          city: data.city,
        })
        if (data.role === 'Shelter' && data.roleDetails) {
          setShelterForm({
            shelterName: data.roleDetails.shelterName ?? '',
            address: data.roleDetails.address ?? '',
            description: data.roleDetails.description ?? '',
            capacity: data.roleDetails.capacity ?? 0,
          })
        }
        if (data.role === 'Sitter' && data.roleDetails) {
          setSitterForm({
            bio: data.roleDetails.bio ?? '',
            pricePerHour: data.roleDetails.pricePerHour ?? 0,
          })
        }
      })
      .catch(() => setError('Greška pri učitavanju profila.'))
      .finally(() => setLoading(false))
  }, [])

  function validateBase(values: UpdateProfilePayload): Partial<UpdateProfilePayload> {
    const e: Partial<UpdateProfilePayload> = {}
    if (!values.firstName.trim()) e.firstName = 'Ime je obavezno.'
    if (!values.lastName.trim()) e.lastName = 'Prezime je obavezno.'
    if (!values.phoneNumber.trim()) e.phoneNumber = 'Telefon je obavezan.'
    if (!values.city.trim()) e.city = 'Grad je obavezan.'
    return e
  }

  async function handleBaseSubmit(e: FormEvent) {
    e.preventDefault()
    setBaseSuccess(false)
    setBaseApiError(null)

    const errors = validateBase(baseForm)
    if (Object.keys(errors).length > 0) {
      setBaseErrors(errors)
      return
    }

    setBaseSaving(true)
    try {
      await userService.updateProfile(baseForm)
      setBaseSuccess(true)
    } catch {
      setBaseApiError('Greška pri čuvanju. Pokušajte ponovo.')
    } finally {
      setBaseSaving(false)
    }
  }

  async function handleShelterSubmit(e: FormEvent) {
    e.preventDefault()
    setShelterSuccess(false)
    setShelterApiError(null)
    setShelterSaving(true)
    try {
      await userService.updateShelterDetails({
        ...shelterForm,
        capacity: Number(shelterForm.capacity) || 0,
      })
      setShelterSuccess(true)
    } catch {
      setShelterApiError('Greška pri čuvanju. Pokušajte ponovo.')
    } finally {
      setShelterSaving(false)
    }
  }

  async function handleSitterSubmit(e: FormEvent) {
    e.preventDefault()
    setSitterSuccess(false)
    setSitterApiError(null)
    setSitterSaving(true)
    try {
      await userService.updateSitterDetails(sitterForm)
      setSitterSuccess(true)
    } catch {
      setSitterApiError('Greška pri čuvanju. Pokušajte ponovo.')
    } finally {
      setSitterSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse" />
        <div className="h-64 bg-white rounded-xl border border-gray-100 animate-pulse" />
      </div>
    )
  }

  if (error || !profile) {
    return <p className="text-sm text-red-500">{error ?? 'Greška.'}</p>
  }

  const isShelter = profile.role === 'Shelter'

  const displayName = isShelter
    ? (profile.roleDetails?.shelterName ?? 'Azil')
    : `${profile.firstName} ${profile.lastName}`

  const avatarLetter = isShelter
    ? (profile.roleDetails?.shelterName?.[0]?.toUpperCase() ?? 'A')
    : (profile.firstName?.[0]?.toUpperCase() ?? '?')

  const BACK_ROUTE = {
    Owner:   '/dashboard/owner/my-dogs',
    Sitter:  '/dashboard/sitter/offers',
    Shelter: '/dashboard/shelter/dogs',
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate(BACK_ROUTE[profile.role])}
        className="text-sm text-gray-400 hover:text-gray-600
                   transition-colors mb-4 flex items-center gap-1"
      >
        ← Nazad
      </button>

      {/* Avatar + info */}
      <div className="bg-white rounded-xl border border-gray-100
                      shadow-card p-6 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-woof-blue-100
                        flex items-center justify-center
                        text-woof-blue-600 text-2xl font-semibold shrink-0">
          {avatarLetter}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{displayName}</h1>
          <p className="text-sm text-gray-400">{profile.email}</p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full
                           bg-woof-blue-100 text-woof-blue-700 font-medium">
            {profile.role}
          </span>
        </div>
      </div>

      {/* Osnovna forma — sakrivena za Shelter */}
      {!isShelter && (
        <div className="bg-white rounded-xl border border-gray-100
                        border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Osnovni podaci
          </h2>

          {baseApiError && <Alert type="error" message={baseApiError} />}
          {baseSuccess && <Alert type="success" message="Podaci su uspešno sačuvani." />}

          <form onSubmit={handleBaseSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ime *"
                value={baseForm.firstName}
                onChange={(e) => {
                  setBaseForm((p) => ({ ...p, firstName: e.target.value }))
                  setBaseErrors((p) => ({ ...p, firstName: undefined }))
                }}
                error={baseErrors.firstName}
              />
              <Input
                label="Prezime *"
                value={baseForm.lastName}
                onChange={(e) => {
                  setBaseForm((p) => ({ ...p, lastName: e.target.value }))
                  setBaseErrors((p) => ({ ...p, lastName: undefined }))
                }}
                error={baseErrors.lastName}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Telefon *"
                type="tel"
                value={baseForm.phoneNumber}
                onChange={(e) => {
                  setBaseForm((p) => ({ ...p, phoneNumber: e.target.value }))
                  setBaseErrors((p) => ({ ...p, phoneNumber: undefined }))
                }}
                error={baseErrors.phoneNumber}
              />
              <Input
                label="Grad *"
                value={baseForm.city}
                onChange={(e) => {
                  setBaseForm((p) => ({ ...p, city: e.target.value }))
                  setBaseErrors((p) => ({ ...p, city: undefined }))
                }}
                error={baseErrors.city}
              />
            </div>
            <div className="mb-4">
              <label className="woof-label">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="woof-input bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <Button type="submit" variant="primary" loading={baseSaving}>
              Sačuvaj izmene
            </Button>
          </form>
        </div>
      )}

      {/* Sitter detalji */}
      {profile.role === 'Sitter' && (
        <div className="bg-white rounded-xl border border-gray-100
                        border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Podaci čuvara
          </h2>

          {sitterApiError && <Alert type="error" message={sitterApiError} />}
          {sitterSuccess && <Alert type="success" message="Podaci su uspešno sačuvani." />}

          <form onSubmit={handleSitterSubmit} noValidate>
            <div className="mb-4">
              <label className="woof-label">Bio / Opis</label>
              <textarea
                rows={4}
                placeholder="Opišite svoje iskustvo sa psima..."
                value={sitterForm.bio}
                onChange={(e) => setSitterForm((p) => ({ ...p, bio: e.target.value }))}
                className="woof-input resize-none"
              />
            </div>
            <Input
              label="Cena po satu (RSD)"
              type="number"
              min="1"
              value={String(sitterForm.pricePerHour)}
              onChange={(e) =>
                setSitterForm((p) => ({ ...p, pricePerHour: Number(e.target.value) }))
              }
            />
            <Button type="submit" variant="primary" loading={sitterSaving}>
              Sačuvaj
            </Button>
          </form>
        </div>
      )}

      {/* Shelter detalji */}
      {isShelter && (
        <div className="bg-white rounded-xl border border-gray-100
                        border-t-4 border-t-woof-blue-600 shadow-card p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Podaci azila
          </h2>

          {shelterApiError && <Alert type="error" message={shelterApiError} />}
          {shelterSuccess && <Alert type="success" message="Podaci su uspešno sačuvani." />}

          <form onSubmit={handleShelterSubmit} noValidate>
            <Input
              label="Naziv azila"
              value={shelterForm.shelterName}
              onChange={(e) =>
                setShelterForm((p) => ({ ...p, shelterName: e.target.value }))
              }
            />
            <Input
              label="Adresa"
              value={shelterForm.address}
              onChange={(e) =>
                setShelterForm((p) => ({ ...p, address: e.target.value }))
              }
            />
            <div className="mb-4">
              <label className="woof-label">Opis azila</label>
              <textarea
                rows={3}
                value={shelterForm.description}
                onChange={(e) =>
                  setShelterForm((p) => ({ ...p, description: e.target.value }))
                }
                className="woof-input resize-none"
              />
            </div>
            <Input
              label="Kapacitet"
              type="number"
              min="1"
              value={String(shelterForm.capacity)}
              onChange={(e) =>
                setShelterForm((p) => ({ ...p, capacity: Number(e.target.value) }))
              }
            />
            <div className="mb-4">
              <label className="woof-label">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="woof-input bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <Button type="submit" variant="primary" loading={shelterSaving}>
              Sačuvaj
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}