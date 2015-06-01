function [rho] = density(T,mixture_params,GCVOL_GC)
%Written by Jacob Backhaus
%Calculates the density each component of the fuel, utilizing the 
%group contribution GCVOL-OL-60 method. units of [g/cm^3]

GCVOL_groups=GCVOL_GC{1};
GCVOL_group_vals=GCVOL_GC{2};
C_atoms=mixture_params{5};
H_atoms=mixture_params{6};
O_atoms=mixture_params{7};
MW=C_atoms.*12.01+H_atoms.*1.008+O_atoms.*16; %moleculat weight of individual components

groupdensity=mixture_params{8};
groupdensityfreq=mixture_params{9};
rho=zeros(length(groupdensity),1);

for i=1:length(MW)
numgroup=groupdensityfreq{i}; %unpacks the number of each group from a cell array
group=length(numgroup); %number of groups for calculation
index=zeros(group,1); %set vector to zeros to save computation
groupnames=groupdensity{i}; %names of each group in component
    
    for j=1:group
        index(j)=find(strcmp(groupnames(j),GCVOL_groups));
    end
   
    A=GCVOL_group_vals(index,1);
    B=GCVOL_group_vals(index,2);
    C=GCVOL_group_vals(index,3);
    
    DELTAv=A+B.*T+C.*T.^2;
    rho(i)=MW(i)./sum(numgroup.*DELTAv);

end

end

