import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  if (request.cookies.cookieExperimental === "hello im a cookie")
    return response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);

  return response
    .status(403)
    .send({ msg: "Sorry. You need the correct cookie" });
});

export default router;
