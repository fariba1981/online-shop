import Product from "@/components/product/Product";
import axios from "axios";
import { handleError } from "lib/helper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Menu = ({ categories, products, error }) => {
  const [productList, setProductList] = useState(products);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const handleFilter = async (value) => {
    let query = {...router.query, ...value}

    if (!value.hasOwnProperty('page')) {
      delete query.page;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/menu?${new URLSearchParams(query).toString()}`);
      setProductList(res.data.data);
      router.push(`/menu?${new URLSearchParams(query).toString()}`, undefined, { shallow: true });

    } catch (error) {
      toast.error(handleError(error));

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="food_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-lg-3">
            <div>
              <label className="form-label">جستجو</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  placeholder="نام محصول ..."
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <button onClick={() => search !== '' && handleFilter({ search })} className="input-group-text" id="basic-addon2">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            <hr />
            <div className="filter-list">
              <div className="form-label">دسته بندی</div>
              <ul>
                {categories &&
                  categories.map((category, index) => (
                    <li key={index} onClick={() => handleFilter({ category: category.id })} 
                    className={router.query.hasOwnProperty('category') && router.query.category == category.id ? "my-2 cursor-pointer filter-list-active" : "my-2 cursor-pointer"}>
                      {category.name}
                    </li>
                  ))}
                {/* <li className="my-2 cursor-pointer filter-list-active">
                  پیتزا
                </li> */}
              </ul>
            </div>
            <hr />
            <div>
              <label className="form-label">مرتب سازی</label>
              <div className="form-check my-2">
                <input
                  className="form-check-input"
                  onChange={() => handleFilter({ sortBy: 'max' })}
                  checked={router.query.hasOwnProperty('sortBy') && router.query.sortBy == 'max'}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                />
                <label
                  className="form-check-label cursor-pointer"
                  htmlFor="flexRadioDefault1"
                >
                  بیشترین قیمت
                </label>
              </div>
              <div className="form-check my-2">
                <input
                  className="form-check-input"
                  onChange={() => handleFilter({ sortBy: 'min' })}
                  checked={router.query.hasOwnProperty('sortBy') && router.query.sortBy == 'min'}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                />
                <label
                  className="form-check-label cursor-pointer"
                  htmlFor="flexRadioDefault2"
                >
                  کمترین قیمت
                </label>
              </div>
              <div className="form-check my-2">
                <input
                  className="form-check-input"
                  onChange={() => handleFilter({ sortBy: 'bestseller' })}
                  checked={router.query.hasOwnProperty('sortBy') && router.query.sortBy == 'bestseller'}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault3"
                />
                <label
                  className="form-check-label cursor-pointer"
                  htmlFor="flexRadioDefault3"
                >
                  پرفروش ترین
                </label>
              </div>
              <div className="form-check my-2">
                <input
                  className="form-check-input"
                  onChange={() => handleFilter({ sortBy: 'sale' })}
                  checked={router.query.hasOwnProperty('sortBy') && router.query.sortBy == 'sale'}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault4"
                />
                <label
                  className="form-check-label cursor-pointer"
                  htmlFor="flexRadioDefault4"
                >
                  با تخفیف
                </label>
              </div>
            </div>
          </div>
          {productList && productList.products.length != 0 ? 
          (<>
            {loading ? 
            (
              <div className="col-sm-12 col-lg-9">
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border"></div>
                </div>
              </div>
            ) : (
              <div className="col-sm-12 col-lg-9">
                <div className="row gx-3">
                  {productList &&
                    productList.products.map((product, index) => (
                      <div key={index} className="col-sm-6 col-lg-4">
                        <Product product={product} />
                      </div>
                    ))}
                </div>
                <nav className="d-flex justify-content-center mt-5">
                  <ul className="pagination">
                    {productList &&
                      productList.meta.links.slice(1, -1).map((link, index) => (
                        <li
                          key={index}
                          className={
                            link.active ? "page-item active" : "page-item"
                          }
                        >
                          <button
                            onClick={() => handleFilter({ page: link.label })}
                            className="page-link"
                          >
                            {link.label}
                          </button>
                        </li>
                      ))}
                  </ul>
                </nav>
              </div>
            )}
            </>) : 
          (
            <div className="col-sm-12 col-lg-9">
              <div className="d-flex justify-content-center align-items-center h-100">
                <h5>
                  محصولی یافت نشد!
                </h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Menu;

export async function getServerSideProps({ resolvedUrl }) {
  //console.log(resolvedUrl);
  try {
    const resCat = await axios.get("/categories");
    const res = await axios.get(`${resolvedUrl}`);
    return {
      props: {
        categories: resCat.data.data,
        products: res.data.data,
      },
    };
  } catch (err) {
    return {
      props: {
        error: handleError(err),
      },
    };
  }
}
