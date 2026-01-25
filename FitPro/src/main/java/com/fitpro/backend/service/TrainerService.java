package com.fitpro.backend.service;

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.Role;
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.repository.AppUserRepository;
import com.fitpro.backend.repository.MemberRepository;
import com.fitpro.backend.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private AppUserRepository userRepo;

    // 1. GET ALL
    public List<Trainer> getAllTrainers() {
        return trainerRepo.findAll();
    }

    // 2. GET ONE
    public Trainer getTrainerById(Long id) {
        return trainerRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer not found with ID: " + id));
    }

    // 3. CREATE (Admin adds a trainer via Map Data) - THIS IS THE IMPORTANT ONE
    public Trainer createTrainer(Map<String, Object> data) {
        String name = (String) data.get("trainerName");
        String email = (String) data.get("email");
        String password = (String) data.get("password");
        String phone = (String) data.get("phone");
        String specialization = (String) data.get("specialization");

        // Step 1: Create the User Account (Login Info)
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword(password); // In a real app, you should encrypt this!
        user.setRole(Role.TRAINER); // Important: Give them Trainer permissions

        // Save User first so we get an ID
        AppUser savedUser = userRepo.save(user);

        // Step 2: Create the Trainer Profile
        Trainer newTrainer = new Trainer();
        newTrainer.setTrainerName(name);
        newTrainer.setPhone(phone);
        newTrainer.setSpecialization(specialization);

        // Step 3: Link them!
        newTrainer.setUser(savedUser);

        // Step 4: Save Trainer
        return trainerRepo.save(newTrainer);
    }

    // 4. UPDATE (PUT - Full Update)
    public Trainer updateTrainer(Long id, Trainer updatedData) {
        Trainer trainer = getTrainerById(id);

        trainer.setTrainerName(updatedData.getTrainerName());
        trainer.setPhone(updatedData.getPhone());
        trainer.setSpecialization(updatedData.getSpecialization());

        return trainerRepo.save(trainer);
    }

    // 5. PATCH (Partial Update)
    public Trainer patchTrainer(Long id, Map<String, Object> updates) {
        Trainer trainer = getTrainerById(id);

        updates.forEach((key, value) -> {
            switch (key) {
                case "trainerName": trainer.setTrainerName((String) value); break;
                case "phone": trainer.setPhone((String) value); break;
                case "specialization": trainer.setSpecialization((String) value); break;
            }
        });
        return trainerRepo.save(trainer);
    }

    // 6. DELETE (The Safety Delete)
    public void deleteTrainer(Long id) {
        Trainer trainer = getTrainerById(id);

        // Unassign members before deleting
        List<Member> assignedMembers = trainer.getMembers();
        if (assignedMembers != null) {
            for (Member m : assignedMembers) {
                m.setTrainer(null);
                memberRepo.save(m);
            }
        }

        trainerRepo.delete(trainer);
    }
}