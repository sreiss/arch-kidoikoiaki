new sheet true
new/edit/delete user true
list user lists des users du sheet
new/edit/delete depense true
get depenses liste des depenses
get bilan
new sheet ( get un Json de users )


Model 
Sheet
    she_id
    she_data_reference
    she_creation_date 

Participant
    prt_id
    prt_uri
    prt_fname
    prt_lname
    prt_email
    prt_share
    
Transaction 
    trs_id
    trs_uri
    trs_description
    trs_amount
    trs_contributor (celui qui paye (fk user ))
    trs_beneficiary {(celui qui recois (fk user )), nbr_part}
    trs_creation_date
    
Depense 
    Bouffe 158 Brian
    Brian 1
    Lucas 1
    Loïc 1
    Pierre 1
    
Pierre Seiler p.s@tamere.com 3