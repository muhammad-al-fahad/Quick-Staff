import "./message.css";

function Message({ message, type, setUser, user }) {
    const closeAlert = () => {
      if(user) setUser({...user, error: "", success: ""});
    }
    
  return (
    <>
      <div className="message">
        <div className={`alert alert-${type} alert-dismissible`} role="alert">
            <div>{message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={closeAlert}></button>
        </div>
      </div>
    </>
  );
}

export default Message;
