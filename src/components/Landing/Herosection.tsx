import '../../App.css'
import svgillustration from '../../assets/18953902_6055598.svg'

const Herosection =()=>{
    return(
<div className="hero shadow-md relative mt-24  -z-10">
<div className="header flex flex-row justify-around p-4 px-2 items-center flex-wrap ">
<div className="left_side ">
<h1 className="" style={{fontWeight:'bold',fontSize:'2rem'}}>
    Bienvenu Sur E_khaytli
</h1>
<h5 style={{fontWeight:'bold',fontSize:'1rem'}}>
    Choisir votre Tailor
</h5>
</div>
<div className="right_side svg">
<img src={svgillustration} alt="" width={300} height={300} />
</div>
</div>
</div>


    )
}
export default Herosection