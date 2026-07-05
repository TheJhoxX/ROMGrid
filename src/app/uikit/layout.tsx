const UiKit = ({ children }: React.PropsWithChildren) => {
    return (
        <div className='p-4'>
            <h1 className='mb-4 text-4xl font-extrabold'>UiKit</h1>
            {children}
        </div>
    )
}

export default UiKit
