<?php

    namespace CheckersBundle\Entity;

    class UserMeta extends EntityBase {
        private $user;
        private $key;
        private $value;

        /**
         * @return mixed
         */
        public function getUser()
        {
            return $this->user;
        }

        /**
         * @param mixed $user
         */
        public function setUser(User $user)
        {
            $this->user = $user;
        }

        /**
         * @return mixed
         */
        public function getKey()
        {
            return $this->key;
        }

        /**
         * @param mixed $key
         */
        public function setKey($key)
        {
            $this->key = $key;
        }

        /**
         * @return mixed
         */
        public function getValue()
        {
            return $this->value;
        }

        /**
         * @param mixed $value
         */
        public function setValue($value)
        {
            $this->value = $value;
        }


    }

