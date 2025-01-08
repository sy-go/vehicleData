'use client'


import { useState, useEffect } from 'react';

export default function VehicleData() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [motDetails, setMotDetails] = useState(null);
  const [motHistory, setMotHistory] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);




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

  
  const addToSuggestions = (reg:string) => {
    const updatedSuggestions = [reg, ...suggestions.filter(s => s !== reg)].slice(0, 5);
    setSuggestions(updatedSuggestions);
    localStorage.setItem('regSuggestions', JSON.stringify(updatedSuggestions));
  };


/*
  const removeFromSuggestions = (reg) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="container w-full p-2">
      <div className="md:flex  justify-center content-center border p-6">
        <p className=" pr-4 content-center">Vehicle & MOT Information for:</p>
        <form onSubmit={handleSubmit} >
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
            placeholder="Enter registration number"
            className="w-80 p-2 mr-2 bg-amber-400 text-black  hover:border  border-blue-600 text-center font-semibold placeholder-gray-500 rounded-md"
            list="regSuggestions"
          />
          <datalist id="regSuggestions" className='m-l-2'>
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
          <button type="submit" className=" w-20 bg-blue-500 text-white p-2 mr-2 rounded-md ">Search</button>
          <button type="button" onClick={clearInput} className=" w-20 bg-blue-500 text-white p-2  rounded-md">Clear</button>
        </form>
        
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap -mx-2 pt-8  ">
        <div className="w-full md:w-1/2 px-2 mb-4 ">
          <h2 className="text-xl font-semibold mb-2 pl-8">Vehicle details</h2>


          { /* vehicleDetails && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(vehicleDetails, null, 2)}
            </pre>
          ) */} {vehicleDetails && (
            <div className='flex border'>
              <ul className='p-2  text-right  '>
                <li className='p-r-1'>Make & Model: </li>
                <li className='p-r-1 '>Colour: </li>
                <li className='p-r-1 '>Year manufactured: </li>
                <li className='p-r-1 '>First registration: </li>
                <li className='p-r-1 '>MOT: </li>
                <li className='p-r-1 '>MOT expires on:</li>
                <li className='p-r-1 '>Road tax status: </li>
                <li className='p-r-1 '>Road Tax renewal due: </li>
                <li className='p-r-1 '>Engine size in CCM: </li>
                <li className='p-r-1 '>Fuel: </li>
                <li className='p-r-1 '>Emisions: </li>
                <li className='p-r-1 '>Last V5 issued on: </li>
                <li className='p-r-1 '>Wheelplan: </li>
                <li className='p-r-1 '>Export: </li>
              </ul>
              <ul className='p-2 '>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.make} {motHistory.model}</li>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.colour}</li>
                <li className='p-r-1 '>{vehicleDetails && vehicleDetails.yearOfManufacture}</li>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.monthOfFirstRegistration}</li>
                <li className='p-r-1 '>{vehicleDetails && vehicleDetails.motStatus === 'Valid' ? 'valid' : 'not valid'}</li>
                <li className='p-r-1 '>{vehicleDetails && new Date(vehicleDetails.motExpiryDate).toLocaleDateString('en-GB')}</li>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.taxStatus}</li>
                <li className='p-r-1 '>{vehicleDetails && new Date(vehicleDetails.taxDueDate).toLocaleDateString('en-GB')}</li>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.engineCapacity}</li>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.fuelType}</li>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.co2Emissions}</li>
                <li className='p-r-1 '> {vehicleDetails && new Date(vehicleDetails.dateOfLastV5CIssued).toLocaleDateString('en-GB')}, type: {vehicleDetails && vehicleDetails.typeApproval}</li>
                <li className='p-r-1 '> {vehicleDetails && vehicleDetails.wheelplan}</li>
                <li className='p-r-1 '>{vehicleDetails && vehicleDetails.markedForExport === true ? 'yes' : 'no'}</li>
              </ul>
            </div>


          )}

        </div>
        <div className="w-full md:w-1/2 px-2 mb-4 ">
          <h2 className="text-xl font-semibold mb-2 pl-8">MOT History</h2>
          <ul>
            {motDetails &&
              motDetails.map((test, index) =>
                <li key={index} className="mb-2 p-2 border">
                  <span className="font-semibold">Test date: </span>
                  {new Date(test.completedDate).toLocaleDateString('en-GB')}
                  <span className="ml-2 font-semibold">Result: </span>
                  <span className={test.testResult === 'PASSED' ? 'text-green-600' : 'text-red-600'}>
                    {test.testResult}
                  </span>
                  <p className='font-semibold'>Mileage: {test.odometerValue}</p>
                  <ul className='p-2'>{test.defects && test.defects.map((par, index) =>
                    <li key={index} >defect type: <span className={par.type === 'ADVISORY' ? 'text-blue-600' : 'text-red-600'}>{par.type}</span>,
                      <p className='ml-2'>details:{par.text}</p>
                    </li>)}
                  </ul>

                </li>
              )
            }
          </ul>

          { /*motHistory && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(motHistory, null, 2)}
            </pre>
          ) */}
        </div>
      </div>
    </div>
  );
}


/*
<div className="w-full md:w-1/2 px-2 mb-4">
  <h2 className="text-xl font-semibold mb-2">MOT History</h2>
  {motHistory && (
    <pre className="bg-gray-100 p-4 rounded overflow-auto">
      {JSON.stringify(motHistory, null, 2)}
    </pre>
  )}
</div>
*/