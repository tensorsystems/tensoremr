export default (req, res) => {
    res.redirect(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`);
  };