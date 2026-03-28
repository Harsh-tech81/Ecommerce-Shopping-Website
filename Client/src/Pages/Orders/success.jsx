
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
function Success() {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-2" style={{padding : '20px',paddingTop : '40px' ,paddingBottom:'40px'}}>
<img src="/success.png" alt="" width="120"/>
<h3 className="text-[25px]" style={{marginBottom : '10px'}}>Your order is placed.</h3>
<p style={{marginTop : '0px'}}>Thank you for your order.</p>
<Link to="/">
  <Button className="btn-org btn-border">
    Back to Home
  </Button>
</Link>
    </div>
  )
}

export default Success
