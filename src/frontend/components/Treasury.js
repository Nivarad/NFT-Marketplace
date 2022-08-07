import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button, Col, Card } from "react-bootstrap";

export default function Treasury(props) {
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState([]);
  const [price, setPrice] = useState(null);
  console.log(props.account);
  const loadOwnedItems = async () => {
    // Load all items that you own and are not for sale
    const itemCount = await props.marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await props.marketplace.items(i);
      console.log(`this is the owner : ${item.owner}`);
      console.log(`this is the account : ${props.account}`);

      if (
        !item.forSale &&
        item.owner.toUpperCase() == props.account.toUpperCase()
      ) {
        console.log("it worked");
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
  const repriceNFT = async (item) => {
    if (price)
      if (price > 0) {
        console.log(props.marketplace.getTotalPrice(item.itemId));
        await (
          await props.marketplace.setPrice(
            item.itemId,
            ethers.utils.parseEther(price.toString())
          )
        ).wait();
      }
  };
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
                  <Form.Control
                    onChange={(e) => setPrice(e.target.value)}
                    size="lg"
                    required
                    type="number"
                    placeholder="Price in PIRATE"
                  />
                  <Button
                    onClick={() => repriceNFT(item)}
                    variant="primary"
                    size="lg"
                    style={{ marginBottom: 3 }}
                  >
                    Reprice
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>You Have No Treasures That Are Not For Sale</h2>
        </main>
      )}
    </div>
  );
}
