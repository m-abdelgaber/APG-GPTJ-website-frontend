const Footer = () => {
    const year = new Date().getFullYear();
  
    return <footer>
        {'Developed by '}
        <a href="https://www.linkedin.com/in/m-abdelgaber/">M. Abdelgaber</a>
        {` for WANLP ${year}`}
        </footer>;
  };
  
  export default Footer;