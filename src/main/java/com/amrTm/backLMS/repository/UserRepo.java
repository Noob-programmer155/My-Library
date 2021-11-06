package com.amrTm.backLMS.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {
	public User getByNameAndEmail(String name, String email); 
	public List<User> findAllByRoleIn(Collection<Role> role);
	public Optional<User> findByEmail(String email);
}
