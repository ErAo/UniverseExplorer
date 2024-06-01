import SolarSystem from "../../../components/SolarSystem";

export default async function Page({ params }) {
    const { model } = params;

    const getModel = async () => {
        const response = await fetch(`http://localhost:3000/api/solarSytstem/${model}`, {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    };
    const solarSystem = await getModel();
    return (
        <>
            <SolarSystem solarSystemDB={{ ...solarSystem }}>

            </SolarSystem>
        </>
    );
}