const React = require("react");
const { useEffect, useState } = React;
const carApi = require("../api/carApi");

const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carApi.getAll().then((res) => {
      setCars(res.data);
      setLoading(false);
    });
  }, []);

  return { cars, loading };
};

module.exports = { useCars };
