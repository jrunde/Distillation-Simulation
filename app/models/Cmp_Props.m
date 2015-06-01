function [mixture_params] = Cmp_Props(components)
%Written by Jacob Backhaus
%Cmp_Props takes an input of a cell array of components, and it divides out
%all of the properties that are of interest.
%
%Modifications
%9/05/2013 by David Rothamer - added coeffiecints for gas phase specific 
%heat as an additional entry in the cell array structure bringing the total
%number of cells in the cell array to 12

k=length(components);

%initialize variable types as cell
groups=cell(k,1);
groupfreq=cell(k,1);
press_sat=cell(k,1); 
groupnames=cell(k,1);
C_atoms=cell(k,1);
H_atoms=cell(k,1);
O_atoms=cell(k,1);
grouprho=cell(k,1);
grouprhofreq=cell(k,1);
groups_Cp=cell(k,1);
groupfreq_Cp=cell(k,1);
CpIGcoeffs = cell(k,1); 


for i=k:-1:1;
    groups(i)=components{i}(1);
    groupfreq(i)=components{i}(2);
    press_sat(i)=components{i}(3);
    groupnames(i)=components{i}(4);
    C_atoms{i}=components{i}{5};
    H_atoms{i}=components{i}{6};
    O_atoms{i}=components{i}{7};
    grouprho(i)=components{i}(8);
    grouprhofreq(i)=components{i}(9);
    groups_Cp(i)=components{i}(10);
    groupfreq_Cp(i)=components{i}(11);
    CpIGcoeffs(i)=components{i}(12); 

end
%formatting pressure coefficients and atoms into more friendly formats
press_sat=[press_sat{1:k}].';  %antoine coefficients
CpIGcoeffs=[CpIGcoeffs{1:k}].';
H_atoms=[H_atoms{1:k}].';
C_atoms=[C_atoms{1:k}].';
O_atoms=[O_atoms{1:k}].';

mixture_params={groups,groupfreq,press_sat,groupnames,C_atoms,H_atoms,O_atoms,grouprho,grouprhofreq,groups_Cp,groupfreq_Cp,CpIGcoeffs};

end

