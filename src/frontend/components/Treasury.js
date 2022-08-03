import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";

export default function Treasury(props) {
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState([]);
  console.log(props.account);
  const loadOwnedItems = async () => {
    // Load all items that you own and are not for sale
    const itemCount = await props.marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await props.marketplace.items(i);
      console.log(item);
      console.log(item.seller);
      console.log(props.account);
      if (!item.forSale && item.seller == props.account) {
        // get uri url from nft contract
        const uri = await props.nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await props.marketplace.getTotalPrice(item.itemId);
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    setLoading(false);
    setOwned(items);
  };
  useEffect(() => {
    loadOwnedItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>There Is No Treasure Here...</h2>
      </main>
    );
  return (
    <div className="flex justify-center">
      {owned.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {owned.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>>There Is No Treasure Here...</h2>
        </main>
      )}
    </div>
  );
}
