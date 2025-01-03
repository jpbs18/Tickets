export default function Form({ title, inputs, onSubmit, errors, buttonText }) {   
    return <form onSubmit={onSubmit}>
        <h1>{title}</h1>
        {inputs.map(({ label, value, onChange, type = "text", id }) => {
            return <div className="form-group">
                <label htmlFor={id || label}>{label}</label>
                <input 
                    id={id || label}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="form-control"    
                />
            </div>
        })}
        {errors && <div>{errors}</div>}
        <button className="btn btn-primary">{buttonText}</button>
    </form>
}