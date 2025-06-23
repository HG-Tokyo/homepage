document.addEventListener('DOMContentLoaded', async function() {
    async function initializeTeamPage() {
        const response = await fetch('/functions/team-data.json');
        if (!response.ok) {
            console.error("Failed to load team-data.json. Please make sure the file exists and is accessible.");
            return;
        }
        const membersList = await response.json();
        membersList.forEach(person => {
            if (person.japaneseName) {
                person.japaneseName = person.japaneseName.replace(/　/g, '').replace(/ /g, '');
            }
        });

        const departmentsOverview = document.getElementById('departments-overview');
        const memberModal = document.getElementById('member-modal');
        const modalMemberPhoto = document.getElementById('modal-member-photo');
        const modalMemberName = document.getElementById('modal-member-name');
        const modalMemberDescription = document.getElementById('modal-member-description');
        const modalCloseButton = document.querySelector('.member-modal-close');

        const membersByGrade = {};
        for (const member of membersList) {
            const grade = member.grade;
            if (!membersByGrade[grade]) {
                membersByGrade[grade] = [];
            }
            membersByGrade[grade].push(member);
        }

        function renderGradesAndMembers() {
            departmentsOverview.innerHTML = `
                <h1 class="headingen">Our Members</h1>
                <p class="headingjp">メンバー紹介</p>    
            `;

            const gradeOrder = ["H3", "H2", "H1", "M3", "M2"];

            gradeOrder.forEach(gradeName => {
                const members = membersByGrade[gradeName];
                if (members && members.length > 0) {
                    members.sort((a, b) => {
                        const getRank = (member) => {
                            if (!member.roles) return 3;
                            if (member.roles.includes("Leader")) return 1;
                            if (member.roles.includes("Sub Leader")) return 2;
                            return 3;
                        };
                        return getRank(a) - getRank(b);
                    });

                    const gradeSection = document.createElement('div');
                    gradeSection.classList.add('department-section');
                    const gradeHeading = document.createElement('h2');
                    gradeHeading.classList.add('department-section-heading');
                    gradeHeading.textContent = gradeName.startsWith("H") ? "高" + gradeName[1] : "中" + gradeName[1];

                    const memberListGrid = document.createElement('div');
                    memberListGrid.classList.add('member-list-grid');

                    members.forEach(member => {
                        const memberCard = document.createElement('div');
                        memberCard.classList.add('member-card');

                        let departments = Array.isArray(member.department) ? member.department : (member.department || '').split(',').map(d => d.trim()).filter(d => d);
                        const departmentLabelsHtml = departments.length > 0 
                            ? `<div class="member-departments">${departments.map(d => `<span class="member-department-label">${d}</span>`).join('')}</div>` 
                            : '';

                        let roles = Array.isArray(member.roles) ? member.roles : (member.roles || '').split(',').map(r => r.trim()).filter(r => r);
                        const roleLabelsHtml = roles.length > 0 
                            ? `<div class="member-roles">${roles.map(role => `<span class="member-role-label">${role}</span>`).join('')}</div>` 
                            : '';

                        const descriptionHtml = (member.japaneseDescription || member.description) 
                            ? `<p class="member-description">${member.japaneseDescription || ''}<br>${member.description || ''}</p>` 
                            : '';

                        memberCard.innerHTML = `
                            <img src="${member.photo}" alt="${member.name}のプロフィール写真" class="member-photo" onerror="this.src='https://placehold.co/150x150/aabbcc/ffffff?text=${member.name.charAt(0)}';">
                            <h3 class="member-name"> ${member.japaneseName} (${member.name})</h3>
                            ${departmentLabelsHtml}
                            ${roleLabelsHtml}
                            ${descriptionHtml}
                        `;
                        memberCard.addEventListener('click', () => openMemberModal(member));
                        memberListGrid.appendChild(memberCard);
                    });

                    departmentsOverview.appendChild(gradeSection);
                    gradeSection.appendChild(gradeHeading);
                    gradeSection.appendChild(memberListGrid);
                }
            });
        }

        function openMemberModal(member) {
            modalMemberPhoto.src = member.photo;
            modalMemberPhoto.alt = `${member.name}`;
            modalMemberName.innerHTML = `${member.japaneseName} (${member.name})`;

            let departments = Array.isArray(member.department) ? member.department : (member.department || '').split(',').map(d => d.trim()).filter(d => d);
            let roles = Array.isArray(member.roles) ? member.roles : (member.roles || '').split(',').map(r => r.trim()).filter(r => r);

            const departmentLabelsHtml = departments.length > 0 
                ? `<div class="member-departments">${departments.map(d => `<span class="member-department-label">${d}</span>`).join('')}</div>` 
                : '';

            const roleLabelsHtml = roles.length > 0 
                ? `<div class="member-roles">${roles.map(role => `<span class="member-role-label">${role}</span>`).join('')}</div>` 
                : '';

            const descriptionText = `
                <p class="member-description">
                    ${member.japaneseDescription || ''}<br>
                    ${member.description || ''}
                </p>
            `;

            modalMemberDescription.innerHTML = descriptionText;

            const modalContent = modalMemberDescription.parentElement;
            const existingLabels = modalContent.querySelectorAll('.member-departments, .member-roles');
            existingLabels.forEach(el => el.remove());
            modalMemberDescription.insertAdjacentHTML('beforebegin', departmentLabelsHtml + roleLabelsHtml);

            modalMemberPhoto.onerror = function() {
                this.src = `https://placehold.co/150x150/aabbcc/ffffff?text=${member.name.charAt(0)}`;
            };

            memberModal.style.display = 'flex';
        }

        function closeMemberModal() {
            memberModal.style.display = 'none';
        }

        renderGradesAndMembers();
        modalCloseButton.addEventListener('click', closeMemberModal);
        memberModal.addEventListener('click', (event) => {
            if (event.target === memberModal) closeMemberModal();
        });
    }

    initializeTeamPage();
});
