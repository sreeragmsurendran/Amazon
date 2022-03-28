import React from 'react'
import { Spinner } from 'react-bootstrap'

export default function LoadingBox() {
  return (
   <Spinner  animation="border" role="status">
        <span className='visually-hiddden'>Loading... </span>
   </Spinner>
  )
}
