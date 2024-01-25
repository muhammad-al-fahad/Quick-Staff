import './product.css'
import { useNavigate } from "react-router-dom";
import Message from "../Message/Message";
import { useEffect, useState } from "react";
import imageUpload from "../../Utils/imageUpload";
import { IntlProvider, FormattedNumber, useIntl } from 'react-intl'

const CurrencyDisplay = ({ value, currencyCode }) => {
  const intl = useIntl();

  // Use Intl.DisplayNames to get the currency symbol
  const currencySymbol = new Intl.DisplayNames(intl.locale, { type: 'currency' }).of(currencyCode);

  return (
    <span>
      <FormattedNumber value={value} style="currency" currency={currencyCode} />
    </span>
  );
};

function Product() {
    const initialState = {
        name: "",
        type: "agro chemicals",
        price: 0,
        description: "",
        logoList: [],
        packing: [],
        search: "",
        success: "",
        error: ""
    }
  const [product, setProduct] = useState([]);
  const [createProduct, setCreateProduct] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [Success, setSuccess] = useState("")
  const [selectAll, setSelectAll] = useState(false);
  const [filterUsers, setFilteredUsers] = useState([])


  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/company-login");
    else return setAccessToken(token);
  }, []);

  useEffect(() => {
    const fetchEmployees = async (token) => {
      try {
        const verifyUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/company/all-products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await verifyUser.json();
        setProduct(result.products);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (accessToken) {
      fetchEmployees(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    const uniqueSkills = Array.from(new Set(createProduct.packing));

    setCreateProduct((prev) => ({...prev, packing: uniqueSkills}));
  }, [createProduct.packing]);

  const UploadImg = (props) => {
    let newImages = []

    const file = [...props.target.files]
    if(file.length === 0) return setCreateProduct({...createProduct, error: 'File does not exist.'})

    file.forEach(files => {         
      newImages.push(files)
      return newImages;
    })

    const count = createProduct.logoList.length
    if(count + newImages.length > 5) return setCreateProduct({...createProduct, error: 'Only 5 Images are allowed!'})

    setCreateProduct({...createProduct, logoList: [...createProduct.logoList, ...newImages]})
  }

  const Delete = (index) => {
    const Img = [...createProduct.logoList]
    Img.splice(index, 1)
    setCreateProduct({...createProduct, logoList: Img})
  }

  const removeSkill = (skillToRemove) => {
    const updatedSkills = createProduct.packing.filter(skill => skill !== skillToRemove);
    setCreateProduct({...createProduct, packing: updatedSkills})
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCreateProduct({...createProduct, [name]: value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let newImg = [];
      let media = await imageUpload(createProduct.logoList)

      media.forEach(img => {
        newImg.push(img.url);
      })

      const verifyUser = await fetch(
        `${process.env.REACT_APP_BASE_URL}/company/add-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: createProduct.name,
            type: createProduct.type,
            price: createProduct.price,
            description: createProduct.description,
            images: newImg,
            packing: createProduct.packing
          })
        }
      );

      const result = await verifyUser.json();
      setLoading(false);
      if(result.success) setCreateProduct({...createProduct, success: "Product Added Success!"})
      window.location.href = "/product"
    } catch (error) {
      console.error(error);
    }
  }

  const handleCheckboxChange = (productId) => {
    setSelectedProductIds((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  }

  const deleteProduct = () => {   
    try {
      setLoading(true)

      selectedProductIds.forEach(async (id) => {
        const verifyUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/company/delete-product?productId=${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            }
          }
        );
  
        const result = await verifyUser.json();
        setLoading(false)
        if(result.success) setCreateProduct({...createProduct, success: result.message})
        window.location.href = "/product"
      })
    } catch(error) {
      console.error(error.message)
    }
  }

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allProductIds = product.map((product) => product._id);
      setSelectedProductIds(allProductIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSearch = (query) => {
    if(product) {
      const filtered = product.filter(pro => pro.name === query);
      setFilteredUsers(filtered)
    }
  };

  return (
    <>
      <div className="total-employees">

          <div className="employee-request">
            <div className="search">
              <input type="search" className="form-control" name="search" placeholder="Search any product..." value={createProduct.search} onChange={handleChange}/>
              <i class="fa-solid fa-magnifying-glass" onClick={() => handleSearch(createProduct.search)}></i>
            </div>

            <div className="add-company">
                <button
                type="button"
                className="continue"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                >
                    <i class="fa-solid fa-plus"></i>
                </button>

                <button className='cancel' onClick={deleteProduct} disabled={selectedProductIds.length === 0}>
                  Delete
                </button>
            </div>

            <table class="table table-striped">
              <thead className="table-head">
                <tr className="table-row">
                  <th scope="col">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="flexCheckDefault" 
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Price</th>
                  <th scope="col">Description</th>
                  <th scope="col">Packing</th>
                </tr>
              </thead>
              <tbody className="table-body">
              {product && filterUsers.length !== 0 ? filterUsers.map((em) => (
                <tr className="table-row" key={em._id}>
                  <td scope='col'>
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="flexCheckDefault" 
                      checked={selectedProductIds.includes(em._id)}
                      onChange={() => handleCheckboxChange(em._id)}
                    />
                  </td>
                  <td scope='col'>
                    <div className="row-image">
                      <img
                        src={em.images ? em.images[0] : 'https://res.cloudinary.com/dqg52thyo/image/upload/v1703871419/images-removebg-preview_pq1avr.png'}
                        alt=""
                      />
                    </div>
                    <p>
                      {em.name}
                    </p>
                  </td>
                  <td scope='col'>{em.type.slice(0,1).toUpperCase() + em.type.slice(1,em.type.length)}</td>
                  <td>
                  <IntlProvider locale='en'>
                    <CurrencyDisplay value={em.price.amount} currencyCode={em.price.currency} />
                  </IntlProvider>
                  </td>
                  <td scope='col' data-bs-toggle="tooltip" data-bs-title={em.description}>{em.description.length < 18 ? em.description : em.description.substring(0,18) + "...." }</td>
                  <td scope='col'>{em.packing[0]}, {em.packing.length > 1 ? em.packing[1] : ""}, {em.packing.length > 2 ? em.packing[2] : ""}</td>
                </tr>
              ))
              : product.map(
                  (em) =>
                    <tr className="table-row" key={em._id}>
                      <td scope='col'>
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="flexCheckDefault" 
                          checked={selectedProductIds.includes(em._id)}
                          onChange={() => handleCheckboxChange(em._id)}
                        />
                      </td>
                      <td scope='col'>
                        <div className="row-image">
                          <img
                            src={em.images ? em.images[0] : 'https://res.cloudinary.com/dqg52thyo/image/upload/v1703871419/images-removebg-preview_pq1avr.png'}
                            alt=""
                          />
                        </div>
                        <p>
                          {em.name}
                        </p>
                      </td>
                      <td scope='col'>{em.type.slice(0,1).toUpperCase() + em.type.slice(1,em.type.length)}</td>
                      <td>
                      <IntlProvider locale='en'>
                        <CurrencyDisplay value={em.price.amount} currencyCode={em.price.currency} />
                      </IntlProvider>
                      </td>
                      <td scope='col' data-bs-toggle="tooltip" data-bs-title={em.description}>{em.description.length < 18 ? em.description : em.description.substring(0,18) + "...." }</td>
                      <td scope='col'>{em.packing[0]}, {em.packing.length > 1 ? em.packing[1] : ""}, {em.packing.length > 2 ? em.packing[2] : ""}</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Product
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Name"
                      name="name"
                      value={createProduct.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlSelect1" class="form-label">
                      Type
                    </label>
                    <select class="form-select" id='exampleFormControlSelect1' aria-label="Default select example" name="type" onChange={handleChange} required>
                      <option value="agro chemicals">Agro Chemicals</option>
                      <option value="fertilizers">Fertilizers</option>
                      <option value="seeds">Seeds</option>
                      <option value="others">Others</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="0"
                      name="price"
                      value={createProduct.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput2" class="form-label">
                      Packing
                    </label>
                    <select class="form-select" id='exampleFormControlInput2' aria-label="Default select example" name="packing" onChange={(e) => setCreateProduct({...createProduct, packing: [...createProduct.packing, e.target.value]})} required>
                      <option value="250ml">250mL</option>
                      <option value="500ml">500mL</option>
                      <option value="1l">1L</option>
                      <option value="250g">250g</option>
                      <option value="500g">500g</option>
                      <option value="1kg">1Kg</option>
                    </select>
                  </div>

                  <div className="mb-3 row">
                  {createProduct.packing && createProduct.packing.map((skill, index) => (
                    <div className="skill col-lg-4" key={index}>
                      <p>{skill.toUpperCase()}</p>
                      <img
                        src="https://res.cloudinary.com/dqg52thyo/image/upload/v1703427817/Crazy%20Tech/cancel_qrtr0o.svg"
                        alt=""
                        style={{cursor: 'pointer'}}
                        onClick={() => removeSkill(skill)}
                      />
                    </div>
                  ))}
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">
                      Description
                    </label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" name='description' onChange={handleChange} rows={3} required></textarea>
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Images
                    </label>
                    <div className='input-group mb-3'>
                      <div className='input-group-prepend d-flex'>
                          <span className='input-group-text h-100'> Upload </span>
                          <input type="file" className='form-control-file' onChange={UploadImg} multiple accept='image/*' style={{opacity: 0, position: 'absolute', left: 2, top: 4, width: '13%'}}/>
                      </div>
                      <div className='form-group border rounded'>
                          <input type="file" className='form-control-file' disabled={true} multiple accept='image/*' style={{opacity: 0, left: 0}}/>
                      </div>          
                    </div>
                    {createProduct.logoList.length > 0 && (
                        <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap' }}>
                          {createProduct.logoList.map((file, index) => (
                            <div className="file_img" key={file}>
                              <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt=""
                                width={50}
                                height={50}
                                style={{ margin: '0.5rem', borderRadius: '10px' }}
                              />
                              <span onClick={() => Delete(index)}>X</span>
                            </div>
                          ))}
                        </div>
                    )}
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="continue" onClick={handleSubmit}>
                  Create
                </button>
              </div>
            </div>
          </div>
      </div>

        {createProduct.error.length > 1 && <Message message={createProduct.error} type="danger" setUser={setCreateProduct} user={createProduct}/>}
        {createProduct.success.length > 1 && <Message message={createProduct.success} type="success" setUser={setCreateProduct} user={createProduct}/>}
        {loading && 
          <div class="d-flex justify-content-center loader" style={{zIndex: "9999"}}>
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        }
    </>
  )
}

export default Product