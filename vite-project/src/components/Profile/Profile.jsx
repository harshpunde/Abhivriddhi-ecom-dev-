import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, ShoppingBag, User, MapPin, 
  ChevronRight, Power, HelpCircle, 
  Edit2, Check, Plus, MoreVertical, Trash2,
  Navigation
} from 'lucide-react';
import { 
  getCurrentUser, updateProfile, deactivateAccount, deleteAccount,
  fetchAddresses, addAddress, updateAddress, deleteAddress
} from '../../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Edit States
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  
  // Address States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    mobile: ''
  });

  const [addressFormData, setAddressFormData] = useState({
    name: '',
    mobile: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    isDefault: false
  });

  const loadData = async () => {
    try {
      const response = await getCurrentUser();
      if (response?.user) {
        setUserData(response.user);
        setFormData({
          firstName: response.user.firstName || response.user.name?.split(' ')[0] || '',
          lastName: response.user.lastName || response.user.name?.split(' ').slice(1).join(' ') || '',
          gender: response.user.gender || '',
          email: response.user.email || '',
          mobile: response.user.mobile || ''
        });
      }

      const addrResponse = await fetchAddresses();
      if (addrResponse?.success) {
        setAddresses(addrResponse.addresses);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (fieldGroup) => {
    try {
      const payload = {};
      if (fieldGroup === 'names') {
        payload.firstName = formData.firstName;
        payload.lastName = formData.lastName;
        payload.gender = formData.gender;
        payload.name = `${formData.firstName} ${formData.lastName}`.trim();
        setIsEditingNames(false);
      } else if (fieldGroup === 'email') {
        payload.email = formData.email;
        setIsEditingEmail(false);
      } else if (fieldGroup === 'mobile') {
        payload.mobile = formData.mobile;
        setIsEditingMobile(false);
      }
      
      await updateProfile(payload);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Use OpenStreetMap Nominatim for free reverse geocoding
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        if (data && data.address) {
          const { city, state, postcode, suburb, road } = data.address;
          setAddressFormData(prev => ({
            ...prev,
            city: city || data.address.town || data.address.village || '',
            state: state || '',
            pincode: postcode || '',
            addressLine1: `${road || ''} ${suburb || ''}`.trim()
          }));
        }
      } catch (err) {
        console.error('Rev-Geo failed:', err);
        alert('Could not fetch address details for your location.');
      } finally {
        setGeoLoading(false);
      }
    }, (error) => {
      setGeoLoading(false);
      alert('Location access denied. Please enable location permissions.');
    });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressFormData);
      } else {
        await addAddress(addressFormData);
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (addr) => {
    setEditingAddressId(addr._id);
    setAddressFormData({
      name: addr.name,
      mobile: addr.mobile,
      addressLine1: addr.addressLine1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type || 'home',
      isDefault: addr.isDefault
    });
    setShowAddressForm(true);
    setOpenMenuId(null);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? You will be logged out.')) {
      try {
        await deactivateAccount();
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('CRITICAL: Are you sure you want to PERMANENTLY DELETE your account? This cannot be undone.')) {
      try {
        await deleteAccount();
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center font-['Inter']">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pt-[150px] pb-12 font-['Inter'] text-slate-800">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-start">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-4 sticky top-24">
          <div className="bg-white p-3 flex items-center gap-4 shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
               <User className="text-white" size={30} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Hello,</p>
              <h2 className="font-bold text-sm truncate">{userData?.name || 'User'}</h2>
            </div>
          </div>

          <nav className="bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div 
              onClick={() => navigate('/orders')}
              className="flex items-center justify-between p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <ShoppingBag className="text-blue-600" size={20} />
                <span className="font-bold text-slate-500 group-hover:text-blue-600 uppercase text-xs tracking-wider">My Orders</span>
              </div>
              <ChevronRight className="text-slate-300" size={18} />
            </div>

            <div className="p-4 border-b border-slate-50 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <User className="text-blue-600" size={20} />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Account Settings</span>
              </div>
              <ul className="pl-9 space-y-4">
                <li 
                  onClick={() => setActiveTab('profile')}
                  className={`text-sm cursor-pointer hover:text-blue-600 transition-colors ${activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                >
                  Profile Information
                </li>
                <li 
                  onClick={() => setActiveTab('addresses')}
                  className={`text-sm cursor-pointer hover:text-blue-600 transition-colors ${activeTab === 'addresses' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                >
                  Manage Addresses
                </li>
                <li className="text-sm cursor-not-allowed text-slate-400 font-medium">PAN Card Information</li>
              </ul>
            </div>

             <div className="p-4 border-b border-slate-50 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <Power className="text-blue-600" size={20} />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Payments</span>
              </div>
              <ul className="pl-9 space-y-4">
                <li className="text-sm cursor-not-allowed text-slate-400 font-medium">Gift Cards</li>
                <li className="text-sm cursor-not-allowed text-slate-400 font-medium">Saved Cards</li>
                <li className="text-sm cursor-not-allowed text-slate-400 font-medium">UPI</li>
              </ul>
            </div>

            <div 
              onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-50 transition-colors group"
            >
              <Power className="text-blue-600 group-hover:text-red-600" size={20} />
              <span className="font-bold text-slate-500 group-hover:text-red-600 uppercase text-xs tracking-wider">Logout</span>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-white shadow-sm border border-slate-100 min-h-[600px] w-full overflow-hidden">
          
          {activeTab === 'profile' ? (
            <div className="p-6 md:p-8 max-w-xl">
              <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold uppercase tracking-tight">Personal Information</h3>
                  <button onClick={() => isEditingNames ? handleUpdate('names') : setIsEditingNames(true)} className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
                    {isEditingNames ? 'SAVE' : 'EDIT'}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <input type="text" disabled={!isEditingNames} value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className={`flex-1 p-3 border rounded text-sm transition-all ${isEditingNames ? 'border-blue-600 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`} placeholder="First Name"/>
                  <input type="text" disabled={!isEditingNames} value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className={`flex-1 p-3 border rounded text-sm transition-all ${isEditingNames ? 'border-blue-600 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`} placeholder="Last Name"/>
                </div>
                <div className="mb-8">
                  <p className="text-sm font-medium mb-3">Your Gender</p>
                  <div className="flex items-center gap-6">
                    {['Male', 'Female'].map(g => (
                      <label key={g} className={`flex items-center gap-2 cursor-pointer text-sm ${!isEditingNames && 'opacity-60 cursor-not-allowed'}`}>
                        <input type="radio" disabled={!isEditingNames} checked={formData.gender === g} onChange={() => setFormData({...formData, gender: g})} className="accent-blue-600 w-4 h-4"/>
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold uppercase tracking-tight">Email Address</h3>
                  <button onClick={() => isEditingEmail ? handleUpdate('email') : setIsEditingEmail(true)} className="text-blue-600 font-bold text-xs hover:underline">
                    {isEditingEmail ? 'SAVE' : 'EDIT'}
                  </button>
                </div>
                <input type="email" disabled={!isEditingEmail} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full sm:w-2/3 p-3 border rounded text-sm ${isEditingEmail ? 'border-blue-600 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}/>
              </section>

              <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold uppercase tracking-tight">Mobile Number</h3>
                  <button onClick={() => isEditingMobile ? handleUpdate('mobile') : setIsEditingMobile(true)} className="text-blue-600 font-bold text-xs hover:underline">
                    {isEditingMobile ? 'SAVE' : 'EDIT'}
                  </button>
                </div>
                <input type="text" disabled={!isEditingMobile} value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className={`w-full sm:w-2/3 p-3 border rounded text-sm ${isEditingMobile ? 'border-blue-600 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}/>
              </section>

              <section className="mb-12 pt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold mb-6">FAQs</h3>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-slate-800">What happens when I update my email address?</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-slate-800">When will my account be updated with the new details?</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">It happens as soon as you confirm the verification and save the changes.</p>
                  </div>
                </div>
              </section>

              <section className="pt-8 border-t border-slate-100 flex flex-col items-start gap-4">
                <button onClick={handleDeactivate} className="text-blue-600 text-sm font-black hover:underline">Deactivate Account</button>
                <button onClick={handleDelete} className="text-red-500 text-sm font-black hover:underline">Delete Account</button>
              </section>
            </div>
          ) : (
            <div className="p-6 md:p-8">
               <h2 className="text-xl font-bold mb-8 uppercase tracking-tight">Manage Addresses</h2>
               
               {/* ADD NEW ADDRESS BUTTON */}
               {!showAddressForm && (
                 <button 
                  onClick={() => { setShowAddressForm(true); setEditingAddressId(null); setAddressFormData({ name: userData.name, mobile: userData.mobile, addressLine1: '', city: '', state: '', pincode: '', type: 'home', isDefault: false }); }}
                  className="w-full mb-6 p-4 border border-slate-200 text-blue-600 flex items-center gap-3 font-bold text-sm tracking-widest hover:bg-slate-50 transition-colors"
                 >
                   <Plus size={18} /> ADD A NEW ADDRESS
                 </button>
               )}

               {/* ADDRESS FORM */}
               {showAddressForm && (
                 <div className="mb-8 p-6 bg-blue-50/30 border border-blue-100 rounded-lg">
                    <h3 className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-6">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                    <form onSubmit={handleSaveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       
                       <button 
                        type="button"
                        onClick={handleUseMyLocation}
                        className="col-span-1 sm:col-span-2 py-3 px-4 bg-blue-600 text-white rounded font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                       >
                         {geoLoading ? (
                           <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                         ) : <Navigation size={16} />}
                         USE MY CURRENT LOCATION
                       </button>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Recipient Name</label>
                         <input type="text" required value={addressFormData.name} onChange={(e) => setAddressFormData({...addressFormData, name: e.target.value})} className="w-full p-3 border rounded text-sm"/>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Mobile Number</label>
                         <input type="text" required value={addressFormData.mobile} onChange={(e) => setAddressFormData({...addressFormData, mobile: e.target.value})} className="w-full p-3 border rounded text-sm"/>
                       </div>
                       <div className="col-span-1 sm:col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Address Details</label>
                         <input type="text" required value={addressFormData.addressLine1} onChange={(e) => setAddressFormData({...addressFormData, addressLine1: e.target.value})} className="w-full p-3 border rounded text-sm" placeholder="Street, House No, Area"/>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">City</label>
                         <input type="text" required value={addressFormData.city} onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} className="w-full p-3 border rounded text-sm"/>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">State</label>
                         <input type="text" required value={addressFormData.state} onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})} className="w-full p-3 border rounded text-sm"/>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Pincode</label>
                         <input type="text" required value={addressFormData.pincode} onChange={(e) => setAddressFormData({...addressFormData, pincode: e.target.value})} className="w-full p-3 border rounded text-sm"/>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Address Type</label>
                         <div className="flex gap-4">
                           {['home', 'work'].map(t => (
                             <label key={t} className="flex items-center gap-2 text-sm font-bold uppercase cursor-pointer">
                               <input type="radio" checked={addressFormData.type === t} onChange={() => setAddressFormData({...addressFormData, type: t})} className="accent-blue-600"/>
                               {t}
                             </label>
                           ))}
                         </div>
                       </div>
                       
                       <div className="col-span-1 sm:col-span-2 flex gap-4 pt-4 border-t border-blue-100">
                          <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-md">SAVE ADDRESS</button>
                          <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-3 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800">CANCEL</button>
                       </div>
                    </form>
                 </div>
               )}

               {/* ADDRESS LIST */}
               <div className="space-y-4">
                 {addresses.length > 0 ? addresses.map(addr => (
                   <div key={addr._id} className="p-6 border border-slate-100 hover:shadow-md transition-shadow relative group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded tracking-wider">
                          {addr.type || 'HOME'}
                        </span>
                        
                        {/* Kebab Menu */}
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === addr._id ? null : addr._id)}
                            className="p-1 text-slate-300 hover:text-slate-600 transition-colors"
                          >
                            <MoreVertical size={20} />
                          </button>
                          {openMenuId === addr._id && (
                            <div className="absolute right-0 top-full mt-1 bg-white shadow-xl border border-slate-100 rounded-lg py-2 z-10 w-32 animate-in fade-in zoom-in-95 duration-200">
                              <button onClick={() => handleEditClick(addr)} className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                <Edit2 size={12}/> Edit
                              </button>
                              <button onClick={() => handleDeleteAddress(addr._id)} className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 size={12}/> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <p className="font-bold text-sm tracking-tight">{addr.name}</p>
                        <p className="font-bold text-sm tracking-tight text-slate-800">{addr.mobile}</p>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
                        {addr.addressLine1}, {addr.city}, {addr.state} - <span className="font-bold text-slate-900">{addr.pincode}</span>
                      </p>
                   </div>
                 )) : (
                   <div className="py-20 text-center border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-xl">
                      <MapPin size={40} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold">No addresses found.</p>
                   </div>
                 )}
               </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
