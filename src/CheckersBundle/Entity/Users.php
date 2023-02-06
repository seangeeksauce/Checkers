<?php
    namespace CheckersBundle\Entity;

    use DateTime;

    use CheckersBundle\Utility\EntityBase;

    use Doctrine\ORM\Mapping as ORM;

    use Symfony\Component\Validator\Constraints as Assert;
    use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
    use Symfony\Component\Security\Core\User\UserInterface;
    use Symfony\Component\Security\Core\User\AdvancedUserInterface;

    class Users extends EntityBase implements AdvancedUserInterface, \Serializable {
        private $username;
        private $password;
        private $plainPassword;
        private $hash;
        private $email;
        private $createdDate;
        private $status;
        private $deleted = false;
        private $is_active = true;
        /**
         * @var boolean
         */

         public function __construct() {
             $this->isActive = true;
             $this->createdDate = new \DateTime();
             // may not be needed, see section on salt below
             // $this->salt = md5(uniqid(null, true));
         }

        /**
         * @return mixed
         */
        public function getStatus()
        {
            return $this->status;
        }

        /**
         * @param mixed $status
         */
        public function setStatus($status)
        {
            $this->status = $status;
        }

        public function setUsername($username)
        {
            $this->username = $username;
        }

        public function getPassword()
        {
            return $this->password;
        }

        public function setPassword($password)
        {
            $this->password = $password;
        }

        public function getHash(){
            return $this->hash;
        }

        public function setHash($hash){
            $this->hash = $hash;
        }

        public function getEmail(){
            return $this->email;
        }

        public function setEmail($email){
            $this->email = $email;
        }

        public function getCreatedDate(){
            return $this->createdDate;
        }

        public function getDeleted(){
            return $this->deleted;
        }

        public function setDeleted($deleted){
            $this->deleted = $deleted;
        }

        public function getPlainPassword(){
            return $this->plainPassword;
        }

        public function setPlainPassword($password){
            $this->plainPassword = $password;
        }

        public function getRoles() {
            return array('ROLE_USER');
        }

        /**
         * String representation of object
         *
         * @link  http://php.net/manual/en/serializable.serialize.php
         * @return string the string representation of the object or null
         * @since 5.1.0
         */
        public function serialize() {
            return serialize([
                $this->id,
                $this->email,
                $this->password,
                $this->deleted,
            ]);
        }
        /**
         * Constructs the object
         *
         * @link  http://php.net/manual/en/serializable.unserialize.php
         * @param string $serialized <p>
         *                           The string representation of the object.
         *                           </p>
         * @return void
         * @since 5.1.0
         */
        public function unserialize($serialized) {
            list(
                $this->id,
                $this->email,
                $this->password,
                $this->deleted
                ) = unserialize($serialized);
        }
        /**
         * Returns the salt that was originally used to encode the password.
         * This can return null if the password was not encoded using a salt.
         *
         * @return string|null The salt
         */
        public function getSalt() {
            return null;
        }
        /**
         * Returns the username used to authenticate the user.
         *
         * @return string The username
         */
        public function getUsername() {
            return $this->username;
        }
        /**
         * Removes sensitive data from the user.
         * This is important if, at any given point, sensitive information like
         * the plain-text password is stored on this object.
         */
        public function eraseCredentials() {}
        /**
         * Checks whether the user's account has expired.
         * Internally, if this method returns false, the authentication system
         * will throw an AccountExpiredException and prevent login.
         *
         * @return bool true if the user's account is non expired, false otherwise
         * @see AccountExpiredException
         */
        public function isAccountNonExpired() {
            return true;
        }
        /**
         * Checks whether the user is locked.
         * Internally, if this method returns false, the authentication system
         * will throw a LockedException and prevent login.
         *
         * @return bool true if the user is not locked, false otherwise
         * @see LockedException
         */
        public function isAccountNonLocked() {
            return true;
        }
        /**
         * Checks whether the user's credentials (password) has expired.
         * Internally, if this method returns false, the authentication system
         * will throw a CredentialsExpiredException and prevent login.
         *
         * @return bool true if the user's credentials are non expired, false otherwise
         * @see CredentialsExpiredException
         */
        public function isCredentialsNonExpired() {
            return true;
        }
        /**
         * Checks whether the user is enabled.
         * Internally, if this method returns false, the authentication system
         * will throw a DisabledException and prevent login.
         *
         * @return bool true if the user is enabled, false otherwise
         * @see DisabledException
         */
        public function isEnabled() {
            return !$this->deleted;
        }
}
