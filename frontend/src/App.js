import React,{useState} from 'react'
import './App.css'
import axios from 'axios'
import {saveAs } from 'file-saver'

function App() {


  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [receipt,setRecipt] = useState('')
  const [price1,setPrice1] = useState(0)
  const [price2,setPrice2] = useState(0)
  const [price3,setPrice3] = useState(0)

  const data = {name,receipt,email,price1,price2,price3}


  const SubmitForm= async(e)=>{
    e.preventDefault()

   await axios.post(`http://localhost:8000/createPdf`,data)//create pdf next=> get pdf
   .then(()=>
        axios.get(`http://localhost:8000/fetchPdf`,{responseType:'blob'})//to fetch the generated pdf
        .then((res)=>{
          const pdfBlob = new Blob([res.data],{type:'application/pdf'}) 
          saveAs(pdfBlob,'InvoiceDocument.pdf')  //to save we use file saver

          //to clear all the inputs after downloading 
          setName('')
          setRecipt('')
          setEmail('')
          setPrice1(0)
          setPrice2(0)
          setPrice3(0)
        })
        .then(()=>
          axios.post("http://localhost:8000/sendPdf",{email:email})
          .then(response=>{
            console.log(response);
            alert(response.data)
          })
        )
   )
  }



  return (
    <div className="main-block">
      <h1>Generate and Download Pdf</h1>
      <form onSubmit={SubmitForm}>
        <div className="info">
          <input type="text" placeholder="Name" name="name" value={name} onChange={(e)=>setName(e.target.value)} autoComplete="off"/>
          <br/>
            <input type="email" placeholder="Email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="off"/>
            <input type="text" placeholder="Recipt Id" name="recipt" value={receipt} onChange={(e)=>setRecipt(e.target.value)} autoComplete="off"/>
            <input type="text" placeholder="Price1" name="price1" value={price1} onChange={(e)=>setPrice1(e.target.value)} autoComplete="off"/>
            <input type="number" placeholder="Price2" name="price2" value={price2}onChange={(e)=>setPrice2(e.target.value)} autoComplete="off"/>
           <input type="number" placeholder="Price3" name="price3" value={price3}onChange={(e)=>setPrice3(e.target.value)} autoComplete="off"/>
        </div>
        <button type="submit">Download Pdf & Send toMail</button>
      </form>
      
    </div>
  );
}

export default App;
