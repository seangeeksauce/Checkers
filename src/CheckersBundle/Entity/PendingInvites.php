<?php
    namespace CheckersBundle\Entity;

    use CheckersBundle\Utility\EntityBase;
    use DateTime;

    class PendingInvites extends EntityBase {
        private $targetUser;
        private $createdOn;
        private $acceptedOn;
        private $inviteType;
        private $status;
        private $sender;

        /**
         * @return Boolean
         */
        private $deleted;

        /**
         * @return mixed
         */
        public function getTargetUser()
        {
            return $this->targetUser;
        }

        public function getSender()
        {
            return $this->sender;
        }

        public function setSender($sender)
        {
            $this->sender = $sender;
        }

        /**
         * @param mixed $targetUser
         */
        public function setTargetUser($targetUser)
        {
            $this->targetUser = $targetUser;
        }

        /**
         * @return mixed
         */
        public function getCreatedOn()
        {
            return $this->createdOn;
        }

        /**
         * @param mixed $createdOn
         */
        public function setCreatedOn(DateTime $createdOn)
        {
            $this->createdOn = $createdOn;
        }

        /**
         * @return mixed
         */
        public function getAcceptedOn()
        {
            return $this->acceptedOn;
        }

        /**
         * @param mixed $acceptedOn
         */
        public function setAcceptedOn(DateTime $acceptedOn)
        {
            $this->acceptedOn = $acceptedOn;
        }

        public function getInviteType()
        {
            return $this->inviteType;
        }

        public function setInviteType($inviteType)
        {
            $this->inviteType = $inviteType;
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

        /**
         * @return mixed
         */
        public function getDeleted()
        {
            return $this->deleted;
        }

        /**
         * @param mixed $deleted
         */
        public function setDeleted($deleted)
        {
            $this->deleted = $deleted;
        }

    }
