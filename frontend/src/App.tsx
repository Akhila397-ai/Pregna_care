import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useEffect, useRef } from 'react';
import { useAppDispatch,useAppSelector } from './store/hooks';
import { getMeThunk, setInitialized } from './store/slices/auth.slice';



const App = () => {
  const dispatch = useAppDispatch();
  const { token, initialized} = useAppSelector((state) => state.auth);
  const hasFetched = useRef(false);
  useEffect(() => {
    if(hasFetched.current) return;
    hasFetched.current = true;

    const storedToken = sessionStorage.getItem('accessToken');
     console.log('[App] storedToken:', storedToken ? 'exists' : 'none');
    console.log('[App] redux token:', token ? 'exists' : 'none');

    if(storedToken) {
      dispatch(getMeThunk())
      
    }else{
      dispatch(setInitialized());
    }

  },[])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#f5f7f0] flex items-center
        justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2ecc71]
            flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white"
              fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <svg className="animate-spin w-6 h-6 text-[#2ecc71]"
            fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <p className="text-sm text-[#5a7a5a] font-medium">
            Loading PregnaCare...
          </p>
        </div>
      </div>
    );
  }




   return   (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
 
   )
    
};

export default App;