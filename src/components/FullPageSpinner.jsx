import Spinner from './Spinner'

function FullPageSpinner() {
    return (
        <div className='page'>
            <div className='spinnerWrap'>
                <div className='spinnerInner'>
                    <Spinner scale={'large'}/>
                </div>
            </div>
        </div>
    )
}

export default FullPageSpinner
