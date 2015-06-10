function [ xi, yi, L, G, P ] = VTflash(zi,T0,Vol_Li,Vol_tot,tol,mixture_params,GCVOL_GC,Unifac_GC )
%Written by David Rothamer 12/13/2013
%   Flash calculation under constant total volume and constant temperature 
%   conditions
%   zi = feed mole fractions
%   T0 = temperature 
%   Vol_Li = initial volume of liquid before calc (volume of feed liquid)
%   Vol_tot = total volume of the container
%   tol = tolerance for solving 
%   mixture_params = mixture information
%   GCVOL_GC = density group contribution parameters
%   Unifac_GC = Unifac group contribution parameters

R=8.314472; %Universal gas constant [J/mol-K]
press_sat=mixture_params{3};
C_atoms=mixture_params{5};
H_atoms=mixture_params{6};
O_atoms=mixture_params{7};
%molecular weight of individual components
MW=C_atoms.*12.01+H_atoms.*1.008+O_atoms.*16; %moleculat weight of individual components

%initialize variables  
xi = zi; 
V_liq = Vol_Li; 
V_tot = Vol_tot; 
V_gas = V_tot - V_liq; 
%vapor pressure of each component
[P_vap]=Pvap(T0,press_sat); 
%density of each component
rho=density(T0,mixture_params,GCVOL_GC);
V_mol=sum(zi.*MW./rho); %volume per mole
F=V_liq/V_mol;          %total moles in the system
%loop iterates to determine the total vapor pressure for an initial vapor 
%to liquid ratio of 4 for a temperature of 310.95[K]
%assumes non reacting.  Total number of moles liquid + vapor = constant
%Calculation is constant T and total volume
err = 1; 
while err > tol 
    %activity coefficients
    [gamma]=UNIFAC(T0,xi,mixture_params,Unifac_GC);
    P_tot=sum(P_vap.*gamma.*xi);    %total pressure
    Ki=(P_vap.*gamma)./P_tot;       %equilibrium ratio
    G=(P_tot.*1000.*V_gas.*1e-6)./(R.*T0); %moles of gas
    L=F-G;                %moles of liquid
    V_mol=sum(xi.*MW./rho);         %volume per mole
    V_liq=L*V_mol;              %update the liquid volume as it is vaporized
    V_gas=V_tot-V_liq;          %update the volume of gas
    xi=zi./(1+(G/F)*(Ki-1)); %equilibrium liquid mole fraction 
    err=abs(sum((zi.*(Ki-1))./(1+(G/F)*(Ki-1)))); %Should be 0 when converged.
end

[gamma]=UNIFAC(T0,xi,mixture_params,Unifac_GC);
Ki=(P_vap.*gamma)./P_tot;       %equilibrium ratio
yi = Ki.*xi; 
P = sum(P_vap.*gamma.*xi);

end

