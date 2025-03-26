'use client'
import VehMain from "@/app/ui/VehMain";
import { Suspense } from 'react';
import { CardSkeleton } from '@/app/ui/skeletons'
import { useState, useEffect } from 'react';
import { VehicleDetails, MotHistory, Defect, MotTest } from '@/app/lib/types';

export default function VehicleData() {
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);;
  const [motDetails, setMotDetails] = useState<MotTest[] | null>(null);
  const [motHistory, setMotHistory] = useState<MotHistory | null>(null);
  const [error, setError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);


  useEffect(() => {
    localStorage.setItem('registrationNumber', registrationNumber);
  }, [registrationNumber]);

  const clearInput = () => {
    setRegistrationNumber('');
    setVehicleDetails(null);
    setMotDetails(null);
    setMotHistory(null);
    localStorage.removeItem('registrationNumber');
  }

  const addToSuggestions = (reg: string) => {
    const updatedSuggestions: string[] = [reg, ...suggestions.filter(s => s !== reg)].slice(0, 5);
    setSuggestions(updatedSuggestions);
    localStorage.setItem('regSuggestions', JSON.stringify(updatedSuggestions));
  };

  /*
    const removeFromSuggestions = (reg: string) => {
      const updatedSuggestions = suggestions.filter(s => s !== reg);
      setSuggestions(updatedSuggestions);
      localStorage.setItem('regSuggestions', JSON.stringify(updatedSuggestions));
    };
  */

  useEffect(() => {
    const savedReg = localStorage.getItem('registrationNumber');
    if (savedReg) {
      setRegistrationNumber(savedReg);
    }

    const savedSuggestions = JSON.parse(localStorage.getItem('regSuggestions') || '[]');
    setSuggestions(savedSuggestions);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setVehicleDetails(null);
    setMotHistory(null);
    addToSuggestions(registrationNumber);

    try {
      const [vehicleResponse, motResponse] = await Promise.all([
        fetch(`/api/dvla`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ registrationNumber }),
        }),
        fetch(`/api/mot?registration=${registrationNumber}`)
      ]);

      if (!vehicleResponse.ok || !motResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const vehicleData = await vehicleResponse.json();
      const motData = await motResponse.json();

      setVehicleDetails(vehicleData);
      setMotHistory(motData);
      setMotDetails(motData.motTests)
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
    }
  };

  return (
    <div className=" w-full p-2">
      <div className="p-2 md:p-6">
        <div className=" mb-4 text-center">
          <span className="font-bold text-2xl text-blue-50 bg-blue-800 p-2 ">Vehicle+MOT</span>
          <span className="font-bold text-2xl text-blue-800 bg-blue-50 p-2 ">Checker</span>
        </div>
        <form onSubmit={handleSubmit} className="text-center mt-8">
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
            placeholder="Enter registration number"
            className="w-60 p-2 mr-2 bg-amber-400 text-black  focus:border-green-600  text-center font-semibold placeholder-gray-500 rounded-md"
            list="regSuggestions"
          />
          <datalist id="regSuggestions" className='m-l-2'>
            {suggestions.map((suggestion: string, index: number) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
          <button type="submit" className=" w-20 m-2 bg-blue-500 text-white p-2 mr-2 rounded-md ">Search</button>
          <button type="button" onClick={clearInput} className=" w-20 m-2 bg-blue-500 text-white p-2  rounded-md">Clear</button>
        </form>

      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap justify-center -mx-2 pt-8  ">

        <div className="w-full md:w-1/2 px-2 mb-4 ">
          <h2 className="text-xl font-semibold mb-2 pl-8">Vehicle details</h2>
          <div className="mb-4 md:mr-8 p-2  bg-blue-900  rounded-md ">
            {vehicleDetails && motHistory ? (
              <table>
                <tbody>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Make and model:</td>
                    <td>{vehicleDetails.make} {motHistory.model}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Year manufactured:</td>
                    <td>{vehicleDetails.yearOfManufacture}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm  text-right'>First registered:</td>
                    <td>{vehicleDetails.monthOfFirstRegistration}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>MOT:</td>
                    <td> {vehicleDetails.motStatus === 'Valid' ? 'valid' : ' not valid'}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>MOT Expires at:</td>
                    <td>{new Date(vehicleDetails.motExpiryDate).toLocaleDateString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Road tax status:</td>
                    <td>{vehicleDetails.taxStatus}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Road tax renewal date:</td>
                    <td>{new Date(vehicleDetails.taxDueDate).toLocaleDateString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Colour:</td>
                    <td>{vehicleDetails.colour}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Fuel:</td>
                    <td>{vehicleDetails.fuelType}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Engine size in ccm:</td>
                    <td>{vehicleDetails.engineCapacity}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>CO2 emissions:</td>
                    <td>{vehicleDetails.co2Emissions}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Last V5 issued on:</td>
                    <td>{new Date(vehicleDetails.dateOfLastV5CIssued).toLocaleDateString('en-GB')}, type: {vehicleDetails.typeApproval}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Wheelplan:</td>
                    <td>{vehicleDetails.wheelplan}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Export:</td>
                    <td>{vehicleDetails.markedForExport ? 'yes' : 'no'}</td>
                  </tr>
                </tbody>

              </table>
            ) : (
              <div className=" space-y-4">
                <div >Make and model:<p className="h-6 bg-sky-700 rounded w-3/4 animate-pulse"></p></div>
                <div >Year manufactured:<p className="h-6 bg-sky-700 rounded w-1/2 animate-pulse"></p></div>
                <div >First registered: <p className="h-6 bg-sky-700 rounded w-5/6 animate-pulse"></p></div>
                <div >MOT:<p className="h-6 bg-sky-700 rounded w-2/3 animate-pulse"></p></div>
                <div >MOT Expires at:<p className="h-4 bg-sky-700 rounded w-3/4 animate-pulse"></p></div>
                <div >Road tax status:<p className="h-4 bg-sky-700 rounded w-1/2 animate-pulse"></p></div>
                <div >Road tax renewal date:<p className="h-4 bg-sky-700 rounded w-5/6 animate-pulse"></p></div>
                <div >Colour:<p className="h-4 bg-sky-700 rounded w-1/4 animate-pulse  "></p></div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4 ">
          <h2 className="text-xl font-semibold mb-2 ">MOT History</h2>

          <ul className="mb-4 md:mr-8 p-2  bg-blue-900  rounded-md ">
            {motDetails ? (
              motDetails.map((test: MotTest, index: number) => (
                <li key={index} className="mb-4 p-2  bg-blue-900  rounded-md ">
                  <span className="font-semibold">Test date: </span>
                  {new Date(test.completedDate).toLocaleDateString('en-GB')}
                  <span className="ml-2 font-semibold">Result: </span>
                  <span className={test.testResult === 'PASSED' ? 'text-green-300 font-extrabold' : 'text-red-400 font-extrabold'}>
                    {test.testResult}
                  </span>
                  <p className='font-semibold'>Mileage: {test.odometerValue}</p>
                  <ul className='p-2'>
                    {test.defects && test.defects.map((par: Defect, index: number) => (
                      <li key={index}>
                        defect type: <span className={par.type === 'ADVISORY' ? 'text-amber-400 font-extrabold' : 'text-rose-400 font-extrabold'}>{par.type}</span>,
                        <p className='ml-4'>details: {par.text}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              [...Array(3)].map((_, index) => (
                <li key={index} className="mb-4 p-2 bg-blue-900  rounded-md  animate-pulse">
                  <div></div>
                  <div >Test date<p className="h-8 bg-sky-700 rounded w-1/4 mb-2"></p></div>
                  <div >Result<p className="h-8 bg-sky-700 rounded w-1/4 mb-2"></p></div>
                  <div >Mileage<p className="h-8 bg-sky-700 rounded w-1/4 mb-2"></p></div>
                  <div className="space-y-2 mt-4">
                    <div >defect type<p className="h-6 bg-sky-700 rounded w-5/6"></p></div>
                    <div ><p className="h-6 bg-sky-700 rounded w-5/6"></p></div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}


