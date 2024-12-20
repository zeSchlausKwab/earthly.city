import dynamic from 'next/dynamic'

const MapWrapper = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
})

export default MapWrapper
