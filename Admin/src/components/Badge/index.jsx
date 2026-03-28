

function Badge(props) {
  return (
    <span style={{padding : '5px 9px'}}  className={`inline-block rounded-full text-[11px] capitalize ${props.status==='pending' && "bg-[#ff5252] text-white"} ${props.status==="confirm" && "bg-green-500 text-white"} ${
        props.status==="delivered" && "bg-green-700 text-white"}`}
    >
      {props.status}
    </span>
  )
}

export default Badge;
